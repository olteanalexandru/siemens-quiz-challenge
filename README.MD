# Class Diagram

## QuizManager Class
- **Attributes:**
  - `currentQuestion`: Keeps track of the current question being displayed.
  - `totalScores`: Maintains the total scores of the user throughout the quiz.
  - `timer`: Manages the timer for each question.

## QuestionManager Class
- **Attributes:**
  - `questions`: Holds the list of questions for the quiz.
  - `currentQuestion`: Tracks the current question being displayed.

## UserSelectionManager Class
- **Attributes:**
  - `userSelections`: Manages the user selections for each question.
  - `totalScoresHistory`: Keeps a history of the user's scores for each question.

## TimerManager Class
- **Attributes:**
  - `time`: Represents the time elapsed during the quiz.

## Relationships
- **QuizManager to QuestionManager:**
  - QuizManager communicates with QuestionManager to get the list of questions (`questions`) and manage the current question (`currentQuestion`).
- **QuizManager to UserSelectionManager:**
  - QuizManager interacts with UserSelectionManager to update the `totalScores` and maintain `totalScoresHistory`.
- **QuizManager to TimerManager:**
  - QuizManager uses TimerManager to handle the quiz timer (`timer`).
- **QuestionManager to UserSelectionManager:**
  - QuestionManager communicates with UserSelectionManager to store and retrieve user selections (`userSelections`).
- **TimerManager to QuizManager:**
  - TimerManager notifies QuizManager when the quiz timer reaches the limit.

# Database Schema

## Quiz Table
- `quiz_id`: Unique identifier for the quiz.
- `total_scores`: Total scores achieved by the user.
- `current_question`: Represents the current question in progress.
- `timer`: Keeps track of the time elapsed during the quiz.

## Question Table
- `question_id`: Unique identifier for each question.
- `question_text`: The text of the question.
- `options`: JSON representation of answer choices.
- `answer`: Index indicating the correct answer.

## UserSelection Table
- `selection_id`: Unique identifier for each user selection.
- `quiz_id`: Foreign key referencing the Quiz Table.
- `user_selection`: Index representing the user's choice.
- `is_timeout`: Indicates if the question timed out.
- `is_correct`: Indicates if the user's selection is correct.

## Timer Table
- `timer_id`: Unique identifier for each timer instance.
- `quiz_id`: Foreign key referencing the Quiz Table.
- `time_taken`: Represents the time taken by the user to complete the quiz.

## Relationships
- **Quiz to Question:**
  - The Quiz table is connected to the Question table through the `quiz_id` foreign key, establishing a one-to-many relationship. One quiz can have multiple questions.
- **Quiz to UserSelection:**
  - The Quiz table and UserSelection table are linked by the `quiz_id` foreign key, indicating a one-to-many relationship. One quiz can have multiple user selections.
- **Question to UserSelection:**
  - The Question table and UserSelection table are connected through the `question_id` foreign key, forming a one-to-many relationship. One question can have multiple user selections.
- **Quiz to Timer:**
  - The Quiz table and Timer table are associated via the `quiz_id` foreign key, representing a one-to-one relationship. Each quiz has one corresponding timer instance.
