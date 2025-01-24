from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",  # Local development
    "https://your-frontend-domain.com"  # Production frontend URL
]}})

# Update database connection setup
try:
    DATABASE_URL = os.getenv('DATABASE_URL')
    if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # Use default connection string for local development
    if not DATABASE_URL:
        DATABASE_URL = 'postgresql://postgres:root@localhost:5432/bus_db'
    
    conn = psycopg2.connect(DATABASE_URL)
    print("Database connected successfully.")
except Exception as e:
    print(f"Database connection error: {e}")

@app.route('/book-seat', methods=['POST'])
def book_seat():
    data = request.get_json()
    user_name = data.get('userName')
    bus_id = data.get('busId')
    source = data.get('source')
    destination = data.get('destination')
    seats = data.get('seats')  # List of selected seat IDs

    try:
        with conn.cursor() as cursor:
            for seat in seats:
                cursor.execute(""" 
                    INSERT INTO booked_details (username, bus_id, source, destination, seat_id)
                    VALUES (%s, %s, %s, %s, %s);
                """, (user_name, bus_id, source, destination, seat))
            conn.commit()
        return jsonify({"message": "Booking successful"}), 201
    except Exception as e:
        print(f'Error occurred during booking: {e}')
        conn.rollback()
        return jsonify({"message": "An error occurred while booking seats."}), 500

@app.route('/search-buses', methods=['POST'])
def search_buses():
    data = request.get_json()
    source = data.get('source')
    destination = data.get('destination')
    date_str = data.get('date')

    try:
        # Validate the input data
        if not source or not destination or not date_str:
            return jsonify({"message": "Please provide source, destination, and date."}), 400

        # Validate and parse the date
        try:
            bus_date = datetime.strptime(date_str, '%Y-%m-%d').date()  # Convert string to date
        except ValueError as ve:
            return jsonify({"message": f"Invalid date format: {str(ve)}"}), 400

        # Query to fetch bus details from the database
        with conn.cursor() as cursor:
            cursor.execute(""" 
                SELECT * FROM bus_details WHERE source = %s AND destination = %s AND bus_date = %s;
            """, (source, destination, bus_date))

            buses = cursor.fetchall()

        if not buses:
            return jsonify({"buses": []}), 200

        bus_list = []
        for bus in buses:
            bus_id = bus[0]
            bus_name = bus[1]
            bus_source = bus[2]
            bus_destination = bus[3]
            bus_time = bus[4]  # Assuming this is of type time
            bus_date = bus[5]  # Assuming this is a date type

            # Handle bus_time and bus_date correctly
            bus_time_str = bus_time.strftime('%H:%M') 
            bus_date_str = bus_date.strftime('%Y-%m-%d') 

            bus_list.append({
                'id': bus_id,
                'busname': bus_name,
                'source': bus_source,
                'destination': bus_destination,
                'time': bus_time_str,
                'date': bus_date_str
            })
        
        return jsonify({"buses": bus_list}), 200

    except Exception as e:
        print(f"Error during bus search: {e}")
        return jsonify({"message": "An error occurred while searching for buses."}), 500

@app.route('/book-ticket', methods=['POST'])
def book_ticket():
    data = request.get_json()
    username = data.get('username')
    bus_id = data.get('busId')
    selected_seats = data.get('selectedSeats')

    try:
        with conn.cursor() as cursor:
            for seat in selected_seats:
                cursor.execute(""" 
                    INSERT INTO booked_details (username, bus_id, seat_number)
                    VALUES (%s, %s, %s);
                """, (username, bus_id, seat))
            conn.commit()
        return jsonify({"message": "Booking successful"}), 201
    except Exception as e:
        print(f'Error booking ticket: {e}')
        conn.rollback()
        return jsonify({"message": "An error occurred while booking the ticket."}), 500

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    try:
        with conn.cursor() as cursor:
            cursor.execute(""" 
                INSERT INTO users (username, email, password)
                VALUES (%s, %s, %s);
            """, (username, email, password))
            conn.commit()
        return jsonify({"message": "Registration successful"}), 201
    except Exception as e:
        conn.rollback()
        print(f"Error during registration: {e}")  # Log the error for debugging
        return jsonify({"message": "An error occurred during registration. Please try again."}), 500

@app.route('/add-bus', methods=['POST'])
def add_bus():
    data = request.get_json()
    bus_name = data.get('busName')
    source = data.get('source')
    destination = data.get('destination')
    bus_time_str = data.get('bus_time')
    bus_date_str = data.get('bus_date')

    try:
        bus_time = datetime.strptime(bus_time_str, '%H:%M').time()  # Convert string to time
        bus_date = datetime.strptime(bus_date_str, '%Y-%m-%d').date()  # Convert string to date

        with conn.cursor() as cursor:
            cursor.execute(""" 
                INSERT INTO bus_details (busName, source, destination, bus_time, bus_date)
                VALUES (%s, %s, %s, %s, %s);
            """, (bus_name, source, destination, bus_time, bus_date))
            conn.commit()
        return jsonify({"message": "Bus details added successfully"}), 201
    except Exception as e:
        conn.rollback()
        print(f"Error adding bus details: {e}")  # Log the error for debugging
        return jsonify({"message": "An error occurred while adding bus details."}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        with conn.cursor() as cursor:
            cursor.execute(""" 
                SELECT * FROM users WHERE username = %s AND password = %s;
            """, (username, password))
            user = cursor.fetchone()

            if user:
                return jsonify({"message": "Login successful"}), 200
            else:
                return jsonify({"message": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"message": "An error occurred during login. Please try again."}), 500

@app.route('/get-bus-details/<int:bus_id>', methods=['GET'])
def get_bus_details(bus_id):
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM bus_details WHERE id = %s;", (bus_id,))
            bus = cursor.fetchone()

            if bus:
                bus_details = {
                    "id": bus[0],
                    "source": bus[1],
                    "destination": bus[2],
                    "bus_time": bus[3].strftime('%H:%M') if bus[3] else None,
                    "bus_date": bus[4].strftime('%Y-%m-%d') if bus[4] else None
                }
                return jsonify(bus_details), 200
            else:
                return jsonify({"message": "Bus not found."}), 404

    except Exception as e:
        print(f"Error fetching bus details: {e}")
        return jsonify({"message": "An error occurred while fetching bus details."}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
