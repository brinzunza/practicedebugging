import { getDatabase } from './db.js';

export class QuestionService {
  constructor() {
    this.db = getDatabase();
  }

  getAllQuestions() {
    try {
      const questions = this.db.questions();
      const progress = this.db.progress();
      
      return questions.map(question => {
        const progressRecord = progress.find(p => p.question_id === question.id);
        return {
          ...question,
          status: progressRecord?.status || null,
          attempts: progressRecord?.attempts || 0,
          time_spent: progressRecord?.time_spent || 0,
          last_attempt: progressRecord?.last_attempt || null,
          user_solution: progressRecord?.user_solution || null
        };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      return [];
    }
  }

  getQuestionById(id) {
    try {
      const questions = this.db.questions();
      const progress = this.db.progress();
      
      const question = questions.find(q => q.id === id);
      if (!question) return null;
      
      const progressRecord = progress.find(p => p.question_id === id);
      
      return {
        ...question,
        status: progressRecord?.status || null,
        attempts: progressRecord?.attempts || 0,
        time_spent: progressRecord?.time_spent || 0,
        last_attempt: progressRecord?.last_attempt || null,
        user_solution: progressRecord?.user_solution || null
      };
    } catch (error) {
      console.error('Failed to fetch question:', error);
      return null;
    }
  }


  updateProgress(questionId, status, userSolution = null, timeSpent = 0) {
    try {
      const progress = this.db.progress();
      const existingIndex = progress.findIndex(p => p.question_id === questionId);

      if (existingIndex >= 0) {
        progress[existingIndex] = {
          ...progress[existingIndex],
          status,
          attempts: progress[existingIndex].attempts + 1,
          time_spent: progress[existingIndex].time_spent + timeSpent,
          last_attempt: new Date().toISOString(),
          user_solution: userSolution
        };
      } else {
        progress.push({
          id: Math.max(...progress.map(p => p.id), 0) + 1,
          question_id: questionId,
          status,
          attempts: 1,
          time_spent: timeSpent,
          last_attempt: new Date().toISOString(),
          user_solution: userSolution
        });
      }

      this.db.setProgress(progress);

      if (status === 'solved') {
        this.updateStats();
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  }

  updateStats() {
    try {
      const questions = this.db.questions();
      const progress = this.db.progress();
      
      const solvedProgress = progress.filter(p => p.status === 'solved');
      const solvedQuestions = solvedProgress.map(p => 
        questions.find(q => q.id === p.question_id)
      ).filter(Boolean);

      const stats = {
        id: 1,
        total_questions_solved: solvedQuestions.length,
        total_time_spent: solvedProgress.reduce((sum, p) => sum + (p.time_spent || 0), 0),
        easy_solved: solvedQuestions.filter(q => q.difficulty === 'easy').length,
        medium_solved: solvedQuestions.filter(q => q.difficulty === 'medium').length,
        hard_solved: solvedQuestions.filter(q => q.difficulty === 'hard').length,
        streak: 0, // Could implement streak logic here
        last_solved_date: new Date().toISOString()
      };

      this.db.setStats(stats);
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }

  getStats() {
    try {
      return this.db.stats();
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return null;
    }
  }

  seedSampleQuestions() {
    const questions = this.db.questions();
    if (questions.length > 0) {
      return; // Already seeded
    }
    
    const sampleQuestions = [
      // EASY DIFFICULTY QUESTIONS
      
      // Python Easy Questions
      {
        title: "List Index Error",
        description: "This function processes a list but crashes with an index error.",
        difficulty: "easy",
        language: "python",
        buggy_code: `def process_list(items):
    for i in range(len(items) + 1):
        print(items[i])

process_list([1, 2, 3])`,
        fixed_code: `def process_list(items):
    for i in range(len(items)):
        print(items[i])

process_list([1, 2, 3])`,
        console_output: `1
2
3
IndexError: list index out of range`,
        expected_output: `1
2
3`,
        explanation: "List Index Out of Range Error - Using len(items) + 1 in range() causes the loop to try accessing an index that doesn't exist. Use len(items) instead.",
        output_explanation: "The expected output should print each list element (1, 2, 3) on separate lines. The buggy code prints 1, 2, 3, then crashes with IndexError when trying to access index 3 (which doesn't exist in a 3-item list).",
        hints: "What's the highest valid index for a list? How does range() work with len()?",
        tags: "lists,indexing,range"
      },
      {
        title: "Indentation Error",
        description: "This Python function has incorrect indentation.",
        difficulty: "easy", 
        language: "python",
        buggy_code: `def calculate_sum(numbers):
    total = 0
for num in numbers:
    total += num
    return total

print(calculate_sum([1, 2, 3, 4]))`,
        fixed_code: `def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(calculate_sum([1, 2, 3, 4]))`,
        console_output: `IndentationError: expected an indented block`,
        expected_output: `10`,
        explanation: "Indentation Error - Python uses indentation to define code blocks. The for loop and return statement must be properly indented inside the function.",
        hints: "Check the indentation levels. All code inside a function must be indented.",
        tags: "indentation,syntax,python-basics"
      },
      {
        title: "Division by Zero",
        description: "This calculator function crashes when dividing by zero.",
        difficulty: "easy",
        language: "python",
        buggy_code: `def divide_numbers(a, b):
    return a / b

print(divide_numbers(10, 2))
print(divide_numbers(5, 0))`,
        fixed_code: `def divide_numbers(a, b):
    if b == 0:
        return "Cannot divide by zero"
    return a / b

print(divide_numbers(10, 2))
print(divide_numbers(5, 0))`,
        console_output: `5.0
ZeroDivisionError: division by zero`,
        expected_output: `5.0
Cannot divide by zero`,
        explanation: "Division by Zero Error - Dividing by zero raises a ZeroDivisionError. Add a check to handle this case before performing the division.",
        output_explanation: "The expected output should be 5.0 (result of 10/2) and then 'Cannot divide by zero' (handled error message). The buggy code outputs 5.0 correctly but then crashes with ZeroDivisionError when attempting 5/0.",
        hints: "What happens when you divide by zero? How can you check for this before dividing?",
        tags: "division,error-handling,validation"
      },
      {
        title: "Variable Name Error",
        description: "This function should return a calculated result but has a naming issue.",
        difficulty: "easy",
        language: "python",
        buggy_code: `def multiply_numbers(x, y):
    result = x * y
    return Result

print(multiply_numbers(4, 5))`,
        fixed_code: `def multiply_numbers(x, y):
    result = x * y
    return result

print(multiply_numbers(4, 5))`,
        console_output: `NameError: name 'Result' is not defined`,
        expected_output: `20`,
        explanation: "Variable Name Error - Python is case-sensitive. The variable is named 'result' (lowercase), not 'Result' (uppercase).",
        hints: "Check the case of your variable names. Python is case-sensitive.",
        tags: "variables,case-sensitive,naming"
      },
      {
        title: "Dictionary KeyError",
        description: "This function crashes when accessing missing dictionary keys.",
        difficulty: "easy",
        language: "python",
        buggy_code: `def get_user_score(scores, username):
    return scores[username]

user_scores = {"alice": 100, "bob": 85}
print(get_user_score(user_scores, "alice"))
print(get_user_score(user_scores, "charlie"))`,
        fixed_code: `def get_user_score(scores, username):
    return scores.get(username, 0)

user_scores = {"alice": 100, "bob": 85}
print(get_user_score(user_scores, "alice"))
print(get_user_score(user_scores, "charlie"))`,
        console_output: `100
KeyError: 'charlie'`,
        expected_output: `100
0`,
        explanation: "KeyError - Accessing non-existent dictionary keys raises KeyError. Use get() method with default value or check if key exists first.",
        hints: "What happens when you access a dictionary key that doesn't exist? How can you provide a default value?",
        tags: "dictionaries,keyerror,get-method"
      },

      // Java Easy Questions
      {
        title: "Array Bounds Exception",
        description: "This Java method has an array index out of bounds error.",
        difficulty: "easy",
        language: "java",
        buggy_code: `public class ArrayProcessor {
    public static void printArray(int[] arr) {
        for (int i = 0; i <= arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
    
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3};
        printArray(numbers);
    }
}`,
        fixed_code: `public class ArrayProcessor {
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
    
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3};
        printArray(numbers);
    }
}`,
        console_output: `1
2
3
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3`,
        expected_output: `1
2
3`,
        explanation: "Array Index Out of Bounds Error - Using <= in the loop condition causes it to access arr[arr.length], which doesn't exist. Use < instead.",
        output_explanation: "The expected output should print each array element (1, 2, 3) on separate lines. The buggy code prints 1, 2, 3, then throws ArrayIndexOutOfBoundsException when trying to access index 3 in a 3-element array (valid indices are 0, 1, 2).",
        hints: "What's the highest valid index for an array? Check your loop condition.",
        tags: "arrays,loops,bounds-checking"
      },
      {
        title: "String Comparison Error",
        description: "This Java string comparison doesn't work correctly.",
        difficulty: "easy",
        language: "java",
        buggy_code: `public class StringChecker {
    public static boolean isValidPassword(String password) {
        String correctPassword = "password123";
        return password == correctPassword;
    }
    
    public static void main(String[] args) {
        System.out.println(isValidPassword("password123"));
        System.out.println(isValidPassword("wrong"));
    }
}`,
        fixed_code: `public class StringChecker {
    public static boolean isValidPassword(String password) {
        String correctPassword = "password123";
        return password.equals(correctPassword);
    }
    
    public static void main(String[] args) {
        System.out.println(isValidPassword("password123"));
        System.out.println(isValidPassword("wrong"));
    }
}`,
        console_output: `false
false`,
        expected_output: `true
false`,
        explanation: "String Comparison Error - Using == compares object references, not content. Use .equals() method to compare string content.",
        hints: "What's the difference between == and .equals() for strings in Java?",
        tags: "strings,comparison,equals,references"
      },
      {
        title: "Missing Semicolon",
        description: "This Java code has a syntax error.",
        difficulty: "easy",
        language: "java",
        buggy_code: `public class Calculator {
    public static int add(int a, int b) {
        int result = a + b
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(add(5, 3));
    }
}`,
        fixed_code: `public class Calculator {
    public static int add(int a, int b) {
        int result = a + b;
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(add(5, 3));
    }
}`,
        console_output: `Compilation error: ';' expected`,
        expected_output: `8`,
        explanation: "Missing Semicolon Error - Java requires semicolons at the end of statements. Add a semicolon after the assignment statement.",
        hints: "Java statements must end with semicolons. Check your syntax.",
        tags: "syntax,semicolons,compilation"
      },
      {
        title: "Integer Division Precision",
        description: "This calculator gives incorrect results for division.",
        difficulty: "easy",
        language: "java",
        buggy_code: `public class Calculator {
    public static double divide(int a, int b) {
        return a / b;
    }
    
    public static void main(String[] args) {
        System.out.println(divide(5, 2));
        System.out.println(divide(7, 3));
    }
}`,
        fixed_code: `public class Calculator {
    public static double divide(int a, int b) {
        return (double) a / b;
    }
    
    public static void main(String[] args) {
        System.out.println(divide(5, 2));
        System.out.println(divide(7, 3));
    }
}`,
        console_output: `2.0
2.0`,
        expected_output: `2.5
2.3333333333333335`,
        explanation: "Integer Division Error - Dividing two integers performs integer division, truncating the decimal. Cast to double for floating-point division.",
        hints: "What happens when you divide two integers in Java? How can you get decimal results?",
        tags: "division,integers,casting,types"
      },

      // SQL Easy Questions
      {
        title: "Missing WHERE Clause",
        description: "This SQL query accidentally deletes all records.",
        difficulty: "easy",
        language: "sql",
        buggy_code: `DELETE FROM users;`,
        fixed_code: `DELETE FROM users WHERE active = 0;`,
        console_output: `All records deleted!`,
        expected_output: `Only inactive users deleted`,
        explanation: "Missing WHERE Clause Error - DELETE without WHERE clause removes all rows. Always specify conditions to avoid accidental data loss.",
        hints: "What happens when you run DELETE without WHERE? How can you specify which rows to delete?",
        tags: "delete,where-clause,data-safety"
      },
      {
        title: "SQL Column Not Found",
        description: "This query references a non-existent column.",
        difficulty: "easy",
        language: "sql",
        buggy_code: `SELECT user_name, email_address, created_date 
FROM users 
ORDER BY creation_date;`,
        fixed_code: `SELECT user_name, email_address, created_date 
FROM users 
ORDER BY created_date;`,
        console_output: `ERROR: column "creation_date" does not exist`,
        expected_output: `Results sorted by created_date`,
        explanation: "Column Name Error - The column is named 'created_date' not 'creation_date'. Check column names in your table schema.",
        hints: "Double-check your column names. Are you using the exact name from the table?",
        tags: "columns,naming,schema"
      },
      {
        title: "GROUP BY Missing Column",
        description: "This query violates GROUP BY rules.",
        difficulty: "easy",
        language: "sql",
        buggy_code: `SELECT department, employee_name, COUNT(*) 
FROM employees 
GROUP BY department;`,
        fixed_code: `SELECT department, COUNT(*) as employee_count
FROM employees 
GROUP BY department;`,
        console_output: `ERROR: column "employee_name" must appear in GROUP BY clause`,
        expected_output: `Department counts displayed`,
        explanation: "GROUP BY Error - All non-aggregate columns in SELECT must be in GROUP BY clause. Remove employee_name or add it to GROUP BY.",
        hints: "What columns can you SELECT when using GROUP BY? Which columns need aggregation functions?",
        tags: "group-by,aggregation,sql-rules"
      },

      // MEDIUM DIFFICULTY QUESTIONS
      
      // Python Medium Questions
      {
        title: "Mutable Default Arguments",
        description: "This function has unexpected behavior with default arguments.",
        difficulty: "medium",
        language: "python",
        buggy_code: `def add_item(item, target_list=[]):
    target_list.append(item)
    return target_list

print(add_item("apple"))
print(add_item("banana"))
print(add_item("cherry"))`,
        fixed_code: `def add_item(item, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list

print(add_item("apple"))
print(add_item("banana"))
print(add_item("cherry"))`,
        console_output: `['apple']
['apple', 'banana']
['apple', 'banana', 'cherry']`,
        expected_output: `['apple']
['banana']
['cherry']`,
        explanation: "Mutable Default Arguments Error - Default list is shared between function calls. Use None as default and create new list inside function.",
        hints: "Why do default mutable arguments persist between function calls? How can you create a fresh default value each time?",
        tags: "functions,default-arguments,mutable,lists"
      },
      {
        title: "Class vs Instance Variables",
        description: "This class has unexpected shared state between instances.",
        difficulty: "medium",
        language: "python",
        buggy_code: `class BankAccount:
    transactions = []
    
    def __init__(self, name):
        self.name = name
        self.balance = 0
    
    def add_transaction(self, amount):
        self.transactions.append(amount)
        self.balance += amount
    
    def get_transactions(self):
        return self.transactions

alice = BankAccount("Alice")
bob = BankAccount("Bob")

alice.add_transaction(100)
bob.add_transaction(50)

print("Alice transactions:", alice.get_transactions())
print("Bob transactions:", bob.get_transactions())`,
        fixed_code: `class BankAccount:
    def __init__(self, name):
        self.name = name
        self.balance = 0
        self.transactions = []
    
    def add_transaction(self, amount):
        self.transactions.append(amount)
        self.balance += amount
    
    def get_transactions(self):
        return self.transactions

alice = BankAccount("Alice")
bob = BankAccount("Bob")

alice.add_transaction(100)
bob.add_transaction(50)

print("Alice transactions:", alice.get_transactions())
print("Bob transactions:", bob.get_transactions())`,
        console_output: `Alice transactions: [100, 50]
Bob transactions: [100, 50]`,
        expected_output: `Alice transactions: [100]
Bob transactions: [50]`,
        explanation: "Class vs Instance Variable Error - Class variables are shared among all instances. Define mutable instance variables in __init__ method.",
        hints: "What's the difference between class variables and instance variables? Where should you initialize instance-specific data?",
        tags: "classes,variables,instance,class-variables"
      },

      // Java Medium Questions  
      {
        title: "Autoboxing NullPointerException",
        description: "This Integer operation throws unexpected NullPointerException.",
        difficulty: "medium",
        language: "java",
        buggy_code: `public class AutoboxingIssue {
    public static void main(String[] args) {
        Integer a = null;
        Integer b = 5;
        int result = a + b;
        System.out.println(result);
    }
}`,
        fixed_code: `public class AutoboxingIssue {
    public static void main(String[] args) {
        Integer a = null;
        Integer b = 5;
        if (a != null && b != null) {
            int result = a + b;
            System.out.println(result);
        } else {
            System.out.println("Cannot add: one or both values are null");
        }
    }
}`,
        console_output: `NullPointerException`,
        expected_output: `Cannot add: one or both values are null`,
        explanation: "Autoboxing NullPointerException - Unboxing null Integer to primitive int throws NPE. Check for null before arithmetic operations.",
        hints: "What happens when you unbox a null Integer? How can you prevent this error?",
        tags: "autoboxing,null-pointer,integers,primitives"
      },
      {
        title: "Enhanced For Loop Modification",
        description: "This loop tries to modify the collection while iterating.",
        difficulty: "medium",
        language: "java",
        buggy_code: `import java.util.*;

public class LoopModification {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("apple");
        list.add("banana");
        list.add("cherry");
        
        for (String item : list) {
            if (item.equals("banana")) {
                list.remove(item);
            }
        }
        
        System.out.println(list);
    }
}`,
        fixed_code: `import java.util.*;

public class LoopModification {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("apple");
        list.add("banana");
        list.add("cherry");
        
        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()) {
            String item = iterator.next();
            if (item.equals("banana")) {
                iterator.remove();
            }
        }
        
        System.out.println(list);
    }
}`,
        console_output: `ConcurrentModificationException`,
        expected_output: `[apple, cherry]`,
        explanation: "Concurrent Modification Error - Modifying collection during enhanced for loop throws exception. Use Iterator.remove() for safe removal.",
        hints: "Why can't you modify a collection while iterating? What's the safe way to remove elements during iteration?",
        tags: "collections,iteration,concurrent-modification,iterator"
      },

      // SQL Medium Questions
      {
        title: "SQL Injection Vulnerability",
        description: "This query is vulnerable to SQL injection attacks.",
        difficulty: "medium",
        language: "sql",
        buggy_code: `-- Java code building SQL query
String query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";`,
        fixed_code: `-- Use parameterized queries instead
String query = "SELECT * FROM users WHERE username = ? AND password = ?";
PreparedStatement stmt = connection.prepareStatement(query);
stmt.setString(1, username);
stmt.setString(2, password);`,
        console_output: `Vulnerable to injection attacks like: '; DROP TABLE users; --`,
        expected_output: `Safe parameterized query execution`,
        explanation: "SQL Injection Vulnerability - String concatenation allows malicious input to alter query structure. Use parameterized queries with placeholders.",
        hints: "Why is string concatenation dangerous in SQL? How do parameterized queries prevent injection?",
        tags: "security,sql-injection,parameterized-queries"
      },
      {
        title: "Ambiguous Column Reference",
        description: "This JOIN query has ambiguous column references.",
        difficulty: "medium",
        language: "sql",
        buggy_code: `SELECT user_id, name, email, order_date
FROM users u
JOIN orders o ON u.user_id = o.user_id
WHERE user_id = 123;`,
        fixed_code: `SELECT u.user_id, u.name, u.email, o.order_date
FROM users u
JOIN orders o ON u.user_id = o.user_id
WHERE u.user_id = 123;`,
        console_output: `ERROR: column reference "user_id" is ambiguous`,
        expected_output: `User and order data for user ID 123`,
        explanation: "Ambiguous Column Error - Both tables have user_id column. Use table aliases to specify which column you mean.",
        hints: "When joining tables with similar column names, how do you specify which table's column you want?",
        tags: "joins,aliases,ambiguous-columns"
      },

      // HARD DIFFICULTY QUESTIONS

      // Python Hard Questions
      {
        title: "Decorator Metadata Loss",
        description: "This decorator doesn't preserve function metadata correctly.",
        difficulty: "hard",
        language: "python",
        buggy_code: `def timing_decorator(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"Function took {end - start:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def calculate_sum(numbers):
    """Calculate sum of numbers in list"""
    return sum(numbers)

print(calculate_sum.__name__)
print(calculate_sum.__doc__)`,
        fixed_code: `import functools

def timing_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"Function took {end - start:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def calculate_sum(numbers):
    """Calculate sum of numbers in list"""
    return sum(numbers)

print(calculate_sum.__name__)
print(calculate_sum.__doc__)`,
        console_output: `wrapper
None`,
        expected_output: `calculate_sum
Calculate sum of numbers in list`,
        explanation: "Decorator Metadata Loss - Decorators replace function metadata. Use @functools.wraps to preserve original function's metadata.",
        hints: "What happens to function names and docstrings when you use decorators? How can you preserve the original metadata?",
        tags: "decorators,functools,metadata,wraps"
      },
      {
        title: "Late Binding Closure",
        description: "This list of functions doesn't behave as expected.",
        difficulty: "hard",
        language: "python",
        buggy_code: `functions = []
for i in range(3):
    functions.append(lambda: i)

for func in functions:
    print(func())`,
        fixed_code: `functions = []
for i in range(3):
    functions.append(lambda i=i: i)

for func in functions:
    print(func())`,
        console_output: `2
2
2`,
        expected_output: `0
1
2`,
        explanation: "Late Binding Closure Error - Lambda functions capture variable by reference, not value. Use default parameter to capture value at definition time.",
        hints: "When are lambda variables evaluated? How can you capture the current value instead of the reference?",
        tags: "lambda,closures,late-binding,scope"
      },

      // Java Hard Questions
      {
        title: "Generic Type Erasure",
        description: "This generic method has type checking issues.",
        difficulty: "hard", 
        language: "java",
        buggy_code: `import java.util.*;

public class TypeErasure {
    public static <T> boolean isInstanceOf(Object obj, Class<T> clazz) {
        return obj instanceof T;  // Won't compile
    }
    
    public static void main(String[] args) {
        String str = "hello";
        System.out.println(isInstanceOf(str, String.class));
    }
}`,
        fixed_code: `import java.util.*;

public class TypeErasure {
    public static <T> boolean isInstanceOf(Object obj, Class<T> clazz) {
        return clazz.isInstance(obj);
    }
    
    public static void main(String[] args) {
        String str = "hello";
        System.out.println(isInstanceOf(str, String.class));
    }
}`,
        console_output: `Compilation error: illegal generic type for instanceof`,
        expected_output: `true`,
        explanation: "Generic Type Erasure Error - Cannot use generic type parameters with instanceof due to type erasure. Use Class.isInstance() method instead.",
        hints: "What happens to generic type information at runtime? How can you check types when generics are erased?",
        tags: "generics,type-erasure,instanceof,runtime-types"
      },

      // SQL Hard Questions
      {
        title: "Recursive CTE Infinite Loop",
        description: "This recursive Common Table Expression creates an infinite loop.",
        difficulty: "hard",
        language: "sql",
        buggy_code: `WITH RECURSIVE employee_hierarchy AS (
    SELECT employee_id, name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    SELECT e.employee_id, e.name, e.manager_id, eh.level + 1
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
)
SELECT * FROM employee_hierarchy;`,
        fixed_code: `WITH RECURSIVE employee_hierarchy AS (
    SELECT employee_id, name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    SELECT e.employee_id, e.name, e.manager_id, eh.level + 1
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id
    WHERE eh.level < 10  -- Prevent infinite recursion
)
SELECT * FROM employee_hierarchy;`,
        console_output: `Infinite recursion - query never terminates`,
        expected_output: `Employee hierarchy up to 10 levels deep`,
        explanation: "Recursive CTE Infinite Loop - Without termination condition, recursive queries can run forever. Add level limit or other stopping conditions.",
        hints: "How do you prevent infinite recursion in CTEs? What conditions should stop the recursion?",
        tags: "cte,recursion,infinite-loop,termination"
      },
      {
        title: "Window Function Partitioning Error",
        description: "This window function has incorrect partitioning logic.",
        difficulty: "hard",
        language: "sql",
        buggy_code: `SELECT 
    employee_id,
    name,
    salary,
    department,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;`,
        fixed_code: `SELECT 
    employee_id,
    name,
    salary,
    department,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as dept_salary_rank
FROM employees;`,
        console_output: `Global salary ranking across all departments`,
        expected_output: `Salary ranking within each department`,
        explanation: "Window Function Partitioning Error - Missing PARTITION BY clause ranks across entire dataset. Add PARTITION BY to rank within groups.",
        hints: "What's the difference between ranking globally vs within groups? When do you need PARTITION BY?",
        tags: "window-functions,partitioning,ranking,grouping"
      }
    ];

    // Add IDs and timestamps to sample questions
    const questionsWithMetadata = sampleQuestions.map((question, index) => ({
      ...question,
      id: index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Directly set questions in the database
    this.db.setQuestions(questionsWithMetadata);
  }
}