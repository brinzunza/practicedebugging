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

  forceReseed() {
    try {
      this.db.setQuestions([]);
      this.db.setProgress([]);
      this.seedSampleQuestions();
      console.log('Database reseeded successfully');
      return true;
    } catch (error) {
      console.error('Failed to reseed database:', error);
      return false;
    }
  }

  seedSampleQuestions() {
    const questions = this.db.questions();
    console.log('Current questions count:', questions.length);

    // Uncomment the next line to force reseeding if needed
    // this.db.setQuestions([]);

    if (questions.length > 0) {
      return; // Already seeded
    }

    console.log('Starting seeding process...');
    
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
        buggy_code: `public class Main {
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
        fixed_code: `public class Main {
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
        buggy_code: `public class Main {
    public static boolean isValidPassword(String password) {
        String correctPassword = "password123";
        return password == correctPassword;
    }

    public static void main(String[] args) {
        System.out.println(isValidPassword("password123"));
        System.out.println(isValidPassword("wrong"));
    }
}`,
        fixed_code: `public class Main {
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
        buggy_code: `public class Main {
    public static int add(int a, int b) {
        int result = a + b
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(add(5, 3));
    }
}`,
        fixed_code: `public class Main {
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
        buggy_code: `public class Main {
    public static double divide(int a, int b) {
        return a / b;
    }
    
    public static void main(String[] args) {
        System.out.println(divide(5, 2));
        System.out.println(divide(7, 3));
    }
}`,
        fixed_code: `public class Main {
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
        buggy_code: `public class Main {
    public static void main(String[] args) {
        Integer a = null;
        Integer b = 5;
        int result = a + b;
        System.out.println(result);
    }
}`,
        fixed_code: `public class Main {
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

public class Main {
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

public class Main {
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

public class Main {
    public static <T> boolean isInstanceOf(Object obj, Class<T> clazz) {
        return obj instanceof T;  // Won't compile
    }
    
    public static void main(String[] args) {
        String str = "hello";
        System.out.println(isInstanceOf(str, String.class));
    }
}`,
        fixed_code: `import java.util.*;

public class Main {
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





      // C Programming Questions
      {
        title: "Buffer Overflow",
        description: "This C program has a buffer overflow vulnerability.",
        difficulty: "medium",
        language: "c",
        buggy_code: `#include <stdio.h>
#include <string.h>

int main() {
    char buffer[10];
    char input[] = "This string is way too long for the buffer";
    strcpy(buffer, input);
    printf("Buffer: %s\\n", buffer);
    return 0;
}`,
        fixed_code: `#include <stdio.h>
#include <string.h>

int main() {
    char buffer[50];
    char input[] = "This string is way too long for the buffer";
    strncpy(buffer, input, sizeof(buffer) - 1);
    buffer[sizeof(buffer) - 1] = '\\0';
    printf("Buffer: %s\\n", buffer);
    return 0;
}`,
        console_output: `Segmentation fault or undefined behavior`,
        expected_output: `Buffer: This string is way too long for the buffer`,
        explanation: "Buffer Overflow Error - strcpy() doesn't check buffer bounds. Use strncpy() and ensure null termination, or allocate sufficient buffer space.",
        hints: "What happens when you copy more data than a buffer can hold? How can you safely copy strings in C?",
        tags: "buffer-overflow,strcpy,memory-safety"
      },

      {
        title: "Pointer Arithmetic Error",
        description: "This C program has incorrect pointer arithmetic.",
        difficulty: "medium",
        language: "c",
        buggy_code: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;
    for (int i = 0; i <= 5; i++) {
        printf("%d ", *ptr);
        ptr++;
    }
    return 0;
}`,
        fixed_code: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;
    for (int i = 0; i < 5; i++) {
        printf("%d ", *ptr);
        ptr++;
    }
    return 0;
}`,
        console_output: `10 20 30 40 50 (garbage value or segfault)`,
        expected_output: `10 20 30 40 50`,
        explanation: "Array Bounds Error - Loop condition <= 5 accesses 6 elements in a 5-element array. Use < 5 to stay within bounds.",
        hints: "How many elements are in the array? What's the highest valid index?",
        tags: "arrays,pointers,bounds-checking"
      },

      {
        title: "Memory Leak",
        description: "This C program has a memory leak.",
        difficulty: "hard",
        language: "c",
        buggy_code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    for (int i = 0; i < 5; i++) {
        int *ptr = malloc(sizeof(int) * 100);
        if (ptr != NULL) {
            printf("Allocated memory block %d\\n", i);
        }
    }
    printf("Done allocating\\n");
    return 0;
}`,
        fixed_code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    for (int i = 0; i < 5; i++) {
        int *ptr = malloc(sizeof(int) * 100);
        if (ptr != NULL) {
            printf("Allocated memory block %d\\n", i);
            free(ptr);
        }
    }
    printf("Done allocating\\n");
    return 0;
}`,
        console_output: `Allocated memory block 0
Allocated memory block 1
Allocated memory block 2
Allocated memory block 3
Allocated memory block 4
Done allocating
(Memory leak detected by tools)`,
        expected_output: `Allocated memory block 0
Allocated memory block 1
Allocated memory block 2
Allocated memory block 3
Allocated memory block 4
Done allocating`,
        explanation: "Memory Leak Error - Every malloc() must have a corresponding free(). Add free(ptr) after using the allocated memory.",
        hints: "What happens to memory allocated with malloc()? How do you release it back to the system?",
        tags: "memory-management,malloc,free,memory-leak"
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