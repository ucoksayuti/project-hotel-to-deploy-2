from flask import Flask, render_template, jsonify, request, url_for, session, redirect, flash, abort
from pymongo import MongoClient
from pymongo import DESCENDING
from datetime import datetime
from bson import ObjectId
import os
import re

connection_string = 'mongodb+srv://mhmmdalfn1502:Alfanaja@cluster0.hh8koxv.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp'
client = MongoClient(connection_string)
db = client.Harmony_Resort

app = Flask(__name__)
app.secret_key = "secret_key"

users = [{"email": "user1", "password": "password1"}]

@app.route('/')
def home():
    articles = list(db.ListKamar.find({}, {'_id': False}).sort('date_created',DESCENDING).limit(6))
    contacts = list(db.contacts.find().sort('date_created', DESCENDING).limit(4))  # Menggunakan metode limit(4) untuk membatasi jumlah data
    return render_template('index.html', articles=articles, contacts=contacts, email=session.get('email'))


# @app.route('/')
# def home():
#     articles = list(db.ListKamar.find({}, {'_id': False}))
#     return render_template('index.html', articles=articles, email=session.get('email'))

# @app.route('/get_data', methods=['GET'])
# def get_data():
#     contacts = list(db.contacts.find())
#     return render_template('index.html', contacts=contacts)

@app.route('/admin/roomnames', methods=['GET'])
def get_room_names():
    room_names = list(db.ListKamar.find({}, {'Name': 1, '_id': False}))
    return jsonify({'room_names': room_names})

# ------------------------------ CRUD ------------------------------ #

# @app.route('/admin', methods=['GET'])
# def show_Data_admin():
#     articles = list(db.ListKamar.find({}, {'_id':False}))
#     return jsonify({'admin.html': articles})

@app.route('/admin', methods=['GET'])
def show_Data():
    articles = list(db.ListKamar.find({}, {'_id':False}))
    return jsonify({'articles': articles})

@app.route('/admin', methods=['POST'])
def save_Data():
    Name_receive = request.form.get('Name_give')
    Price_receive = request.form.get('Price_give')

    today = datetime.now()
    mytime = today.strftime('%Y-%m-%d %H-%M-%S')

    file = request.files['file_give']
    file_extension = file.filename.split('.')[-1]
    filename = f'static/post-{mytime}.{file_extension}'
    file.save(filename)

    doc = {
        'file': filename,
        'Name': Name_receive,
        'Price': Price_receive,
    }
    db.ListKamar.insert_one(doc)
    return jsonify({'message': 'data was saved!!!'})

@app.route('/edit/<Name>', methods=['GET', 'POST'])
def edit_item(Name):
    if request.method == 'GET':
        data = db.ListKamar.find_one({'Name': Name}, {'_id': False})
        return render_template('Edit.html', data=data)
    
    elif request.method == 'POST':
        new_Name = request.form.get('edit-Name')
        new_Price = request.form.get('edit-Price')

        update_data = {'$set': {'Name': new_Name, 'Price': new_Price}}
        db.ListKamar.update_one({'Name': Name}, update_data)

        return jsonify({'success': True, 'message': 'Changes saved successfully'})

@app.route('/delete/<Name>', methods=['DELETE'])
def delete_data(Name):
    try:
        db.ListKamar.delete_one({'Name': Name})
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
    
def check_admin_role():
    if 'email' in session and session['role'] == 'admin':
        return True
    return False

@app.route('/admin-page')
def admin_page():
    return render_template('admin.html')
    
# ------------------------------ SignUp/SignIn/SignOut ------------------------------ #

@app.route('/signup')
def signup_page():
    return render_template('signup.html')

def is_valid_password(password):
    """
    Validasi password memenuhi persyaratan:
    - Minimal satu huruf besar
    - Minimal satu huruf kecil
    - Minimal satu angka
    """
    return bool(re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$', password)) and len(password) >= 8

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    signup_data = {} 

    if request.method == 'POST':
        session['signup_data'] = request.form

        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        # Validasi dan konfirmasi password
        if password != confirm_password:
            flash('Password and Confirm Password do not match', 'danger')
            return render_template('signup.html', signup_data=signup_data)

        # Validasi password sesuai persyaratan
        if not is_valid_password(password):
            flash('Password must contain at least one uppercase letter, and one digit. Minimum length is 8 characters.', 'danger')
            return render_template('signup.html', signup_data=signup_data)

        # Mengecek alamat email sudah terdaftar atau belum
        existing_user = db.dataregis.find_one({'email': email})
        if existing_user:
            flash('Email is already registered. Please use a different email.', 'danger')
            return render_template('signup.html', signup_data=signup_data)

        # Menentukan peran pengguna
        role = "user"  # Default role
        admin_emails = ["Admin1@HarmonyResort.com", "Admin2@HarmonyResort.com"]
        if email in admin_emails:
            role = "admin"

        db.dataregis.insert_one({
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "password": password,
            "role": role
        })

        session['email'] = email

        if email in admin_emails:
            session['role'] = "admin"

        session.pop('signup_data', None)

        return redirect(url_for('signin'))

    if 'signup_data' in session:
        signup_data = session['signup_data']
        session.pop('signup_data')

    return render_template('signup.html', signup_data=signup_data)

@app.route('/signin', methods=['POST', 'GET'])
def signin():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = db.dataregis.find_one({"email": email, "password": password})

        if user:
            session['email'] = email
            session['first_name'] = user.get('first_name', '')  # Nyimpan firstname
            session['last_name'] = user.get('last_name', '')  # Nyimpan lastname
            session['role'] = user.get('role', 'user')  # peran nya sebagai user

            if session['role'] == 'admin':
                return redirect(url_for('admin_page'))  # Kalau peran nya admin, nnti diarahkan ke halaman admin

            return redirect(url_for('home'))  # Kalau peran nya user, nnti diarahkan ke halaman dashboard
        else:
            flash('Invalid email or password. Please try again.', 'danger')

    return render_template('signin.html')

@app.route('/admin/checkemail/<email>', methods=['GET'])
def check_email(email):
    existing_email = db.dataregis.find_one({'email': email})
    if existing_email:
        abort(400, 'Email has already been registered.')
    return jsonify({'message': 'Email is available'})

@app.route('/signup')
def signin_page():
    return render_template('signin.html')

@app.route('/logout')
def logout():
    session.pop('email', None)
    session.pop('first_name', None)
    session.pop('last_name', None)
    return redirect(url_for('home'))

# ------------------------------ Contact ------------------------------ #

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        contacts_collection = db.contacts
        contacts_collection.insert_one({'name': name, 'email': email, 'message': message})
        return render_template('contact.html', success=True)
    else:
        return render_template('contact.html', email=session.get('email'))
    
# ------------------------------ Review ------------------------------ #

@app.route('/Review-admin', methods = ['GET'])
def review_admin():
    contacts = list(db.contacts.find())
    return render_template('Review.html', contacts=contacts)

@app.route('/delete-contact/<name>', methods=['DELETE'])
def delete_contact(name):
    try:
        result = db.contacts.delete_one({'name': name})
        if result.deleted_count == 1:
            return jsonify({'message': 'Contact deleted successfully'})
        else:
            return jsonify({'message': 'Contact not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------------------ About ------------------------------ #


@app.route('/about')
def about_us():
    return render_template('about.html', email=session.get('email'))


# ------------------------------ Gallery ------------------------------ #

@app.route('/gallery')
def gallery():
    return render_template('gallery.html', email=session.get('email'))



@app.route('/book')
def order():
    if 'email' not in session:
        return redirect(url_for('signin'))
    else:
        return render_template('book.html')
    
# ------------------------------ Rooms ------------------------------ #

@app.route('/rooms')
def room():
    articles = list(db.ListKamar.find({}, {'_id':False}))
    return render_template('rooms.html', articles=articles)

# ------------------------------ Booking ------------------------------ #


@app.route('/booking/<room_type>')
def booking(room_type):
    articles = list(db.ListKamar.find({}, {'_id':False}))
    selected_room = next((room for room in articles if room['Name'] == room_type), None)
    if not selected_room:
        return "Room not found", 404
    return render_template('booking.html', selected_room=selected_room, articles=articles)

@app.route('/submit_reservation', methods=['POST'])
def submit_reservation():
    data = request.get_json()

    reservation_data = {
        'entryDate': data['entryDate'],
        'exitDate': data['exitDate'],
        'numberOfPeople': data['numberOfPeople'],
        'roomType': data['roomType'],
        'ordererName': data['ordererName'],
        'ordererEmail': data['ordererEmail'],
        'ordererPhoneNumber': data['ordererPhoneNumber'],
        'metodePembayaran': data['metodePembayaran'],
        'harga': data['harga'],
        'jumlah_hari': data['jumlah_hari']
    }
        
    try:
        db.reservation_collection.insert_one(reservation_data)
        response = {'status': 'success', 'message': 'Reservation data saved successfully!'}
    except Exception as e:
        response = {'status': 'error', 'message': f'Error saving reservation dataa: {str(e)}'}

    return jsonify(response)

# ------------------------------ Reservation ------------------------------ #

@app.route("/Reservation-admin", methods=['GET'])
def reservation():
    reservations = list(db.reservation_collection.find())
    return render_template('reservation.html', reservations=reservations)

@app.route('/delete-reservation/<reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    try:
        result = db.reservation_collection.delete_one({'_id': ObjectId(reservation_id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Reservation deleted successfully'})
        else:
            return jsonify({'message': 'Reservation not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route('/delete-contact/<name>', methods=['DELETE'])
# def delete_contact(name):
#     try:
#         result = db.contacts.delete_one({'name': name})
#         if result.deleted_count == 1:
#             return jsonify({'message': 'Contact deleted successfully'})
#         else:
#             return jsonify({'message': 'Contact not found'}), 404
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


if __name__== '__main__':
    app.run('0.0.0.0', port=5000, debug=True)