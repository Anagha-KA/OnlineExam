from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nebula.db'
db = SQLAlchemy(app)

# Models
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50)) # e.g., Technical, Biology
    q_type = db.Column(db.String(20))    # MCQ, MATCHING
    statement = db.Column(db.Text)
    data_payload = db.Column(db.JSON)   # Options or Pairs

class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    questions = db.Column(db.String(200)) # IDs of questions: "1,4,5"

# Add this to your Models section
class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100))
    exam_title = db.Column(db.String(100))
    score = db.Column(db.Integer)
    status = db.Column(db.String(20))

# Add this to your Routes section
@app.route('/api/admin/results', methods=['GET'])
def get_results():
    results = Result.query.all()
    return jsonify([{
        "student_name": r.student_name,
        "exam_title": r.exam_title,
        "score": r.score,
        "status": r.status
    } for r in results])

@app.route('/api/questions', methods=['GET', 'POST'])
def manage_questions():
    if request.method == 'POST':
        data = request.json
        new_q = Question(category=data['category'], q_type=data['q_type'], 
                         statement=data['statement'], data_payload=data['data_payload'])
        db.session.add(new_q)
        db.session.commit()
        return jsonify({"message": "Saved!"})
    
    questions = Question.query.all()
    return jsonify([{"id": q.id, "statement": q.statement, "q_type": q.q_type} for q in questions])

@app.route('/api/admin/exams', methods=['POST'])
def save_exam():
    data = request.json
    new_exam = Exam(
        title=data['title'],
        questions=data['question_ids'] # IDs stored as "1,2,5"
    )
    db.session.add(new_exam)
    db.session.commit()
    return jsonify({"message": "Exam Created!"})

# --- ADD THESE ROUTES HERE ---

@app.route('/api/exams', methods=['GET'])
def get_all_exams():
    """Returns a list of all available exams for the Student Dashboard"""
    exams = Exam.query.all()
    return jsonify([{
        "id": e.id, 
        "title": e.title, 
        "question_count": len(e.questions.split(',')) if e.questions else 0
    } for e in exams])

@app.route('/api/exams/<int:exam_id>', methods=['GET'])
def get_single_exam(exam_id):
    """Fetches a specific exam and its associated questions for the Exam Portal"""
    exam = db.session.get(Exam, exam_id) # Using modern session.get
    if not exam:
        return jsonify({"error": "Exam not found"}), 404
        
    # Convert string "1,2" to list of integers [1, 2]
    question_ids = [int(id) for id in exam.questions.split(',') if id.strip()]
    
    # Fetch only the questions that belong to this exam
    questions = Question.query.filter(Question.id.in_(question_ids)).all()
    
    return jsonify({
        "title": exam.title,
        "questions": [{
            "id": q.id, 
            "q_type": q.q_type, 
            "statement": q.statement, 
            "data_payload": q.data_payload
        } for q in questions]
    })

@app.route('/api/exams/submit', methods=['POST'])
def submit_exam():
    data = request.json
    student_name = data.get('student_name', 'Anonymous Student')
    exam_id = data.get('exam_id')
    user_answers = data.get('answers') # Dict of {question_id: answer}

    exam = db.session.get(Exam, exam_id)
    question_ids = [int(id) for id in exam.questions.split(',') if id.strip()]
    questions = Question.query.filter(Question.id.in_(question_ids)).all()

    correct_count = 0
    total_questions = len(questions)

    for q in questions:
        user_ans = user_answers.get(str(q.id))
        # Logic for MCQ
        if q.q_type == 'MCQ':
            if user_ans == q.data_payload.get('answer'):
                correct_count += 1
        # Logic for Matching (simplified)
        elif q.q_type == 'MATCHING':
            correct_mapping = q.data_payload.get('correct_mapping')
            # Check if user matches are identical to the correct mapping
            if user_ans == correct_mapping:
                correct_count += 1

    score_percentage = int((correct_count / total_questions) * 100)
    status = "Pass" if score_percentage >= 50 else "Fail"

    # Save to the Result table
    new_result = Result(
        student_name=student_name,
        exam_title=exam.title,
        score=score_percentage,
        status=status
    )
    db.session.add(new_result)
    db.session.commit()

    return jsonify({
        "score": score_percentage,
        "status": status,
        "correct_count": correct_count,
        "total": total_questions
    })

@app.route('/api/admin/results', methods=['GET'])
def get_all_results():
    """Fetches all student exam scores for the Admin Reports page"""
    results = Result.query.all()
    return jsonify([{
        "id": r.id,
        "student_name": r.student_name,
        "exam_title": r.exam_title,
        "score": r.score,
        "status": r.status
    } for r in results])

@app.route('/api/student/results/<name>', methods=['GET'])
def get_student_results(name):
    """Fetch all exam results for a specific student name"""
    results = Result.query.filter_by(student_name=name).all()
    return jsonify([{
        "exam_title": r.exam_title,
        "score": r.score,
        "status": r.status
    } for r in results])

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

# Route for Registration
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400
    
    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        password=data['password'] # In a real app, use hashing!
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)