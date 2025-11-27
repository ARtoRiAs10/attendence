# import cv2
# import os
# import numpy as np
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from datetime import date, datetime
# from sklearn.neighbors import KNeighborsClassifier
# import pandas as pd
# import joblib

# # --- SETUP ---
# app = Flask(__name__)
# CORS(app)

# nimgs = 10
# datetoday = date.today().strftime("%m_%d_%y")
# datetoday2 = date.today().strftime("%d-%B-%Y")

# # Ensure 'haarcascade_frontalface_default.xml' is in the same folder
# face_detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# # Ensure directories exist
# if not os.path.isdir('Attendance'): os.makedirs('Attendance')
# if not os.path.isdir('static'): os.makedirs('static')
# if not os.path.isdir('static/faces'): os.makedirs('static/faces')

# if f'Attendance-{datetoday}.csv' not in os.listdir('Attendance'):
#     with open(f'Attendance/Attendance-{datetoday}.csv', 'w') as f:
#         f.write('Name,Roll,Time')

# # --- HELPER FUNCTIONS ---
# def totalreg():
#     return len(os.listdir('static/faces'))

# def extract_faces(img):
#     try:
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         face_points = face_detector.detectMultiScale(gray, 1.2, 5, minSize=(20, 20))
#         return face_points
#     except:
#         return []

# def identify_face(facearray):
#     model = joblib.load('static/face_recognition_model.pkl')
#     return model.predict(facearray)

# def train_model():
#     faces = []
#     labels = []
#     userlist = os.listdir('static/faces')
    
#     if not userlist: return

#     for user in userlist:
#         for imgname in os.listdir(f'static/faces/{user}'):
#             img = cv2.imread(f'static/faces/{user}/{imgname}')
#             if img is None: continue
#             resized_face = cv2.resize(img, (50, 50))
#             faces.append(resized_face.ravel())
#             labels.append(user)
            
#     if len(faces) > 0:
#         faces = np.array(faces)
#         knn = KNeighborsClassifier(n_neighbors=5)
#         knn.fit(faces, labels)
#         joblib.dump(knn, 'static/face_recognition_model.pkl')

# def extract_attendance():
#     try:
#         df = pd.read_csv(f'Attendance/Attendance-{datetoday}.csv')
#         names = df['Name'].tolist()
#         rolls = df['Roll'].tolist()
#         times = df['Time'].tolist()
#         l = len(df)
#         return names, rolls, times, l
#     except:
#         return [], [], [], 0

# def add_attendance(name):
#     username = name.split('_')[0]
#     userid = name.split('_')[1]
#     current_time = datetime.now().strftime("%H:%M:%S")

#     df = pd.read_csv(f'Attendance/Attendance-{datetoday}.csv')
#     if int(userid) not in list(df['Roll']):
#         with open(f'Attendance/Attendance-{datetoday}.csv', 'a') as f:
#             f.write(f'\n{username},{userid},{current_time}')

# # --- ROUTES ---

# @app.route('/')
# def home():
#     names, rolls, times, l = extract_attendance()
#     return jsonify({"names": names, "rolls": rolls, "times": times, "l": l})

# # 1. START ATTENDANCE
# @app.route('/start', methods=['GET'])
# def start():
#     if 'face_recognition_model.pkl' not in os.listdir('static'):
#         return jsonify({"mess": "There is no trained model. Please add a new user first."})

#     cap = cv2.VideoCapture(0)
#     if not cap.isOpened():
#          return jsonify({"mess": "Could not open Camera. If on Codespaces, this feature is disabled."}), 500

#     ret = True
#     while ret:
#         ret, frame = cap.read()
#         if not ret: break
        
#         if len(extract_faces(frame)) > 0:
#             (x, y, w, h) = extract_faces(frame)[0]
#             cv2.rectangle(frame, (x, y), (x+w, y+h), (86, 32, 251), 1)
#             face = cv2.resize(frame[y:y+h, x:x+w], (50, 50))
#             identified_person = identify_face(face.reshape(1, -1))[0]
#             add_attendance(identified_person)
#             cv2.putText(frame, f'{identified_person}', (x,y-15), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,255), 1)
        
#         cv2.imshow('Attendance', frame)
#         if cv2.waitKey(1) == 27: # Press ESC to exit
#             break
            
#     cap.release()
#     cv2.destroyAllWindows()
    
#     names, rolls, times, l = extract_attendance()
#     return jsonify({"names": names, "rolls": rolls, "times": times, "l": l})

# # 2. ADD USER (Fixed: Uses logic from your original code)
# @app.route('/add', methods=['POST'])
# def add():
#     newusername = request.form.get('newusername')
#     newuserid = request.form.get('newuserid')

#     if not newusername or not newuserid:
#         return jsonify({"success": False, "message": "Name and ID required"}), 400

#     userimagefolder = 'static/faces/'+newusername+'_'+str(newuserid)
#     if not os.path.isdir(userimagefolder):
#         os.makedirs(userimagefolder)

#     cap = cv2.VideoCapture(0)
    
#     # ERROR CHECK FOR CLOUD ENVIRONMENTS
#     if not cap.isOpened():
#         return jsonify({"success": False, "message": "Cannot open camera. Are you running this on GitHub Codespaces? Camera only works on Localhost."}), 500

#     i, j = 0, 0
#     while 1:
#         _, frame = cap.read()
#         faces = extract_faces(frame)
#         for (x, y, w, h) in faces:
#             cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 20), 2)
#             cv2.putText(frame, f'Images Captured: {i}/{nimgs}', (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 20), 2, cv2.LINE_AA)
#             if j % 5 == 0:
#                 name = newusername+'_'+str(i)+'.jpg'
#                 cv2.imwrite(userimagefolder+'/'+name, frame[y:y+h, x:x+w])
#                 i += 1
#             j += 1
#         if j == nimgs*5:
#             break
#         cv2.imshow('Adding new User', frame)
#         if cv2.waitKey(1) == 27:
#             break
            
#     cap.release()
#     cv2.destroyAllWindows()
    
#     print('Training Model...')
#     train_model()
    
#     return jsonify({"success": True, "message": "User added and model trained"})

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=8080)

# import cv2
# import os
# import numpy as np
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from datetime import date, datetime
# from sklearn.neighbors import KNeighborsClassifier
# import pandas as pd
# import joblib

# app = Flask(__name__)
# CORS(app)

# # --- CONFIG ---
# datetoday = date.today().strftime("%m_%d_%y")

# # Load Face Detector (Ensure xml file is in same folder)
# face_detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# # Create directories
# if not os.path.isdir('Attendance'): os.makedirs('Attendance')
# if not os.path.isdir('static'): os.makedirs('static')
# if not os.path.isdir('static/faces'): os.makedirs('static/faces')

# # Create Daily CSV
# if f'Attendance-{datetoday}.csv' not in os.listdir('Attendance'):
#     with open(f'Attendance/Attendance-{datetoday}.csv', 'w') as f:
#         f.write('Name,Roll,Time')

# # --- HELPERS ---

# def totalreg():
#     return len(os.listdir('static/faces'))

# def extract_faces(img):
#     try:
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         # Detect faces
#         face_points = face_detector.detectMultiScale(gray, 1.2, 5, minSize=(20, 20))
#         return face_points
#     except:
#         return []

# def identify_face(facearray):
#     model = joblib.load('static/face_recognition_model.pkl')
#     return model.predict(facearray)

# def train_model():
#     faces = []
#     labels = []
#     userlist = os.listdir('static/faces')
    
#     if not userlist: return

#     for user in userlist:
#         for imgname in os.listdir(f'static/faces/{user}'):
#             img_path = f'static/faces/{user}/{imgname}'
#             img = cv2.imread(img_path)
#             if img is None: continue
#             # Resize to match the training size
#             resized_face = cv2.resize(img, (50, 50))
#             faces.append(resized_face.ravel())
#             labels.append(user)

#     if len(faces) > 0:
#         faces = np.array(faces)
#         knn = KNeighborsClassifier(n_neighbors=5)
#         # Handle case where we have fewer than 5 total images in system
#         if len(faces) < 5:
#             knn = KNeighborsClassifier(n_neighbors=len(faces))
#         knn.fit(faces, labels)
#         joblib.dump(knn, 'static/face_recognition_model.pkl')

# def extract_attendance():
#     try:
#         df = pd.read_csv(f'Attendance/Attendance-{datetoday}.csv')
#         return df['Name'].tolist(), df['Roll'].tolist(), df['Time'].tolist(), len(df)
#     except:
#         return [], [], [], 0

# def add_attendance(name):
#     username = name.split('_')[0]
#     userid = name.split('_')[1]
#     current_time = datetime.now().strftime("%H:%M:%S")

#     df = pd.read_csv(f'Attendance/Attendance-{datetoday}.csv')
#     # Convert Roll to str for comparison to avoid type errors
#     if str(userid) not in [str(x) for x in df['Roll']]:
#         with open(f'Attendance/Attendance-{datetoday}.csv', 'a') as f:
#             f.write(f'\n{username},{userid},{current_time}')

# # --- ROUTES ---

# @app.route('/')
# def home():
#     names, rolls, times, l = extract_attendance()
#     return jsonify({"names": names, "rolls": rolls, "times": times, "l": l})

# # 1. TAKE ATTENDANCE VIA IMAGE UPLOAD
# @app.route('/start', methods=['POST'])
# def start():
#     if 'face_recognition_model.pkl' not in os.listdir('static'):
#         return jsonify({"mess": "Model not trained. Add a user first."}), 400

#     file = request.files.get('attendance_image')
#     if not file:
#         return jsonify({"mess": "No file uploaded"}), 400

#     # Convert uploaded file to CV2 image
#     filestr = file.read()
#     npimg = np.frombuffer(filestr, np.uint8)
#     frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

#     if frame is None:
#         return jsonify({"mess": "Invalid Image File"}), 400

#     faces = extract_faces(frame)
#     if len(faces) == 0:
#         return jsonify({"mess": "No face detected in uploaded image"}), 200

#     # Process all faces found in the image
#     for (x, y, w, h) in faces:
#         face = cv2.resize(frame[y:y+h, x:x+w], (50, 50))
#         identified_person = identify_face(face.reshape(1, -1))[0]
#         add_attendance(identified_person)

#     names, rolls, times, l = extract_attendance()
#     return jsonify({"names": names, "rolls": rolls, "times": times, "l": l})

# # 2. ADD USER VIA IMAGE UPLOAD
# @app.route('/add', methods=['POST'])
# def add():
#     newusername = request.form.get('newusername')
#     newuserid = request.form.get('newuserid')
#     file = request.files.get('user_image')

#     if not newusername or not newuserid or not file:
#         return jsonify({"success": False, "message": "Missing Name, ID or Image"}), 400

#     userimagefolder = f'static/faces/{newusername}_{newuserid}'
#     if not os.path.isdir(userimagefolder):
#         os.makedirs(userimagefolder)

#     # Convert uploaded file to CV2 image
#     filestr = file.read()
#     npimg = np.frombuffer(filestr, np.uint8)
#     frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

#     faces = extract_faces(frame)
    
#     if len(faces) == 0:
#         return jsonify({"success": False, "message": "No face detected. Please upload a clear photo."}), 400

#     # Get the largest face in the image
#     (x, y, w, h) = faces[0]
#     face_img = frame[y:y+h, x:x+w]

#     # Save 5 copies of the face to ensure we have enough data for KNN (n_neighbors=5)
#     # In a real app, you'd upload 5 different angles, but this is a quick hack for single upload.
#     for i in range(5):
#         cv2.imwrite(f'{userimagefolder}/{newusername}_{i}.jpg', face_img)

#     print('Training Model...')
#     train_model()
    
#     return jsonify({"success": True, "message": "User added and model trained."})

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=8080)
import cv2
import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import date, datetime
from sklearn.neighbors import KNeighborsClassifier
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://attendence-lilac.vercel.app"}})

# --- CONFIG ---
datetoday = date.today().strftime("%m_%d_%y")

# Load Face Detector (Ensure XML file is in same folder)
face_detector = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# Create directories
os.makedirs('Attendance', exist_ok=True)
os.makedirs('static', exist_ok=True)
os.makedirs('static/faces', exist_ok=True)

# Create daily CSV if not exists
csv_file = f'Attendance/Attendance-{datetoday}.csv'
if not os.path.isfile(csv_file):
    with open(csv_file, 'w') as f:
        f.write('Name,Roll,Time')

# Helper Functions
def totalreg():
    return len(os.listdir('static/faces'))

def extract_faces(img):
    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_points = face_detector.detectMultiScale(gray, 1.2, 5, minSize=(20, 20))
        return face_points
    except Exception:
        return []

def identify_face(facearray):
    model_path = 'static/face_recognition_model.pkl'
    if not os.path.isfile(model_path):
        return []
    model = joblib.load(model_path)
    return model.predict(facearray)

def train_model():
    faces = []
    labels = []
    userlist = os.listdir('static/faces')
    if not userlist: 
        return
    for user in userlist:
        for imgname in os.listdir(f'static/faces/{user}'):
            img_path = f'static/faces/{user}/{imgname}'
            img = cv2.imread(img_path)
            if img is None: continue
            resized_face = cv2.resize(img, (50, 50))
            faces.append(resized_face.ravel())
            labels.append(user)
    if len(faces) > 0:
        faces = np.array(faces)
        knn = KNeighborsClassifier(n_neighbors=min(5,len(faces)))
        knn.fit(faces, labels)
        joblib.dump(knn, 'static/face_recognition_model.pkl')

def extract_attendance():
    try:
        df = pd.read_csv(csv_file)
        return df['Name'].tolist(), df['Roll'].tolist(), df['Time'].tolist(), len(df)
    except Exception:
        return [], [], [], 0

def add_attendance(name):
    username = name.split('_')[0]
    userid = name.split('_')[1]
    current_time = datetime.now().strftime("%H:%M:%S")

    df = pd.read_csv(csv_file)
    if str(userid) not in [str(x) for x in df['Roll']]:
        with open(csv_file, 'a') as f:
            f.write(f'\n{username},{userid},{current_time}')

# Routes

@app.route('/')
def home():
    names, rolls, times, l = extract_attendance()
    return jsonify({"names": names, "rolls": rolls, "times": times, "l": l})

# 1. TAKE ATTENDANCE VIA IMAGE UPLOAD
@app.route('/start', methods=['POST'])
def start():
    model_path = 'static/face_recognition_model.pkl'
    if not os.path.isfile(model_path):
        return jsonify({"mess": "Model not trained. Add a user first."}), 400

    file = request.files.get('attendance_image')
    if not file:
        return jsonify({"mess": "No file uploaded"}), 400

    filestr = file.read()
    npimg = np.frombuffer(filestr, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    if frame is None:
        return jsonify({"mess": "Invalid Image File"}), 400

    faces = extract_faces(frame)
    if len(faces) == 0:
        return jsonify({"mess": "No face detected in uploaded image"}), 200

    for (x, y, w, h) in faces:
        face = cv2.resize(frame[y:y+h, x:x+w], (50, 50))
        identified_person = identify_face(face.reshape(1, -1))
        if len(identified_person) > 0:
            add_attendance(identified_person[0])

    names, rolls, times, l = extract_attendance()
    return jsonify({"names": names, "rolls": rolls, "times": times, "l": l})

# 2. ADD USER VIA IMAGE UPLOAD (consistent with form keys)
@app.route('/add', methods=['POST'])
def add():
    newusername = request.form.get('newusername')
    newuserid = request.form.get('newuserid')
    file = request.files.get('user_image')

    if not newusername or not newuserid or not file:
        return jsonify({"success": False, "message": "Missing Name, ID or Image"}), 400

    user_folder = f'static/faces/{newusername}_{newuserid}'
    os.makedirs(user_folder, exist_ok=True)

    filestr = file.read()
    npimg = np.frombuffer(filestr, np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    faces = extract_faces(frame)
    if len(faces) == 0:
        return jsonify({"success": False, "message": "No face detected. Please upload a clear photo."}), 400

    (x, y, w, h) = faces[0]
    face_img = frame[y:y+h, x:x+w]

    for i in range(5):
        cv2.imwrite(f'{user_folder}/{newusername}_{i}.jpg', face_img)

    train_model()
    return jsonify({"success": True, "message": "User added and model trained."})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
