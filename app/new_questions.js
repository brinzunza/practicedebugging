export const sampleQuestions = [
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
      {
        title: "String Concatenation TypeError",
        description: "This function fails when trying to concatenate string and number.",
        difficulty: "easy",
        language: "python",
        buggy_code: `def create_message(name, age):
    return "Hello, " + name + ". You are " + age + " years old."

print(create_message("Alice", 25))`,
        fixed_code: `def create_message(name, age):
    return "Hello, " + name + ". You are " + str(age) + " years old."

print(create_message("Alice", 25))`,
        console_output: `TypeError: can only concatenate str (not "int") to str`,
        expected_output: `Hello, Alice. You are 25 years old.`,
        explanation: "String Concatenation Error - Cannot concatenate string and integer directly. Convert number to string using str() function.",
        hints: "What type is the age parameter? How can you convert numbers to strings in Python?",
        tags: "strings,concatenation,type-conversion"
      },
      {
        title: "Infinite Loop",
        description: "This while loop never stops running.",
        difficulty: "easy",
        language: "python",
        buggy_code: `counter = 5
while counter > 0:
    print(f"Count: {counter}")

print("Done!")`,
        fixed_code: `counter = 5
while counter > 0:
    print(f"Count: {counter}")
    counter -= 1

print("Done!")`,
        console_output: `Count: 5
Count: 5
Count: 5
... (infinite loop)`,
        expected_output: `Count: 5
Count: 4
Count: 3
Count: 2
Count: 1
Done!`,
        explanation: "Infinite Loop Error - The counter variable is never modified inside the loop, so the condition always remains true. Decrement the counter.",
        hints: "What needs to change inside the loop to eventually make the condition false?",
        tags: "loops,infinite-loop,counter"
      },
      {
        title: "List Append vs Extend",
        description: "This function doesn't combine lists correctly.",
        difficulty: "easy",
        language: "python",
        buggy_code: `def combine_lists(list1, list2):
    list1.append(list2)
    return list1

result = combine_lists([1, 2, 3], [4, 5, 6])
print(result)`,
        fixed_code: `def combine_lists(list1, list2):
    list1.extend(list2)
    return list1

result = combine_lists([1, 2, 3], [4, 5, 6])
print(result)`,
        console_output: `[1, 2, 3, [4, 5, 6]]`,
        expected_output: `[1, 2, 3, 4, 5, 6]`,
        explanation: "List Append vs Extend Error - append() adds the entire second list as a single element. Use extend() to add individual elements.",
        hints: "What's the difference between append() and extend()? What should happen to the individual elements?",
        tags: "lists,append,extend,methods"
      },
      {
        title: "Global vs Local Variable",
        description: "This function doesn't update the global variable as expected.",
        difficulty: "medium",
        language: "python",
        buggy_code: `score = 0

def increase_score(points):
    score = score + points

increase_score(10)
print(score)`,
        fixed_code: `score = 0

def increase_score(points):
    global score
    score = score + points

increase_score(10)
print(score)`,
        console_output: `UnboundLocalError: local variable 'score' referenced before assignment`,
        expected_output: `10`,
        explanation: "Global Variable Error - Assigning to a variable in a function makes it local. Use 'global' keyword to modify global variables.",
        hints: "Why does Python think 'score' is a local variable? How can you tell Python to use the global variable?",
        tags: "variables,global,local,scope"
      },
      {
        title: "Loop Variable Overwriting",
        description: "This loop overwrites an important variable.",
        difficulty: "medium",
        language: "python",
        buggy_code: `i = 100
squares = []
for i in range(5):
    squares.append(i * i)

print(f"i is now: {i}")
print(f"squares: {squares}")`,
        fixed_code: `i = 100
squares = []
for x in range(5):
    squares.append(x * x)

print(f"i is now: {i}")
print(f"squares: {squares}")`,
        console_output: `i is now: 4
squares: [0, 1, 4, 9, 16]`,
        expected_output: `i is now: 100
squares: [0, 1, 4, 9, 16]`,
        explanation: "Variable Overwriting Error - Loop variables persist after the loop ends and overwrite existing variables with the same name. Use a different variable name (like 'x' or 'j') to avoid overwriting 'i'.",
        hints: "What happens to the loop variable after a for loop completes? How can you avoid overwriting existing variables?",
        tags: "loops,variable-scope,naming,for-loop"
      },
      {
        title: "Exception Handling Order",
        description: "This exception handling catches the wrong exceptions.",
        difficulty: "medium",
        language: "python",
        buggy_code: `def safe_divide(a, b):
    try:
        return a / b
    except Exception as e:
        print("General error occurred")
    except ZeroDivisionError:
        print("Cannot divide by zero")
    except TypeError:
        print("Invalid types for division")

print(safe_divide(10, 0))
print(safe_divide("10", 2))`,
        fixed_code: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("Cannot divide by zero")
    except TypeError:
        print("Invalid types for division")
    except Exception as e:
        print("General error occurred")

print(safe_divide(10, 0))
print(safe_divide("10", 2))`,
        console_output: `General error occurred
None
General error occurred
None`,
        expected_output: `Cannot divide by zero
None
Invalid types for division
None`,
        explanation: "Exception Order Error - More specific exceptions must come before general ones. Exception catches all exceptions first.",
        hints: "In what order should you catch exceptions? Why doesn't the specific exception handler run?",
        tags: "exceptions,error-handling,order,specificity"
      },
      {
        title: "Generator vs List Memory",
        description: "This function uses too much memory for large datasets.",
        difficulty: "medium",
        language: "python",
        buggy_code: `def get_large_numbers(limit):
    result = [x**2 for x in range(limit)]  # Creates entire list in memory
    print(f"Created list with {len(result)} elements")
    return result

# This uses lots of memory and takes long time
large_nums = get_large_numbers(10000000)
for i, num in enumerate(large_nums):
    if i >= 3:
        break
    print(num)`,
        fixed_code: `def get_large_numbers(limit):
    return (x**2 for x in range(limit))  # Generator - lazy evaluation

# This uses minimal memory and starts immediately
large_nums = get_large_numbers(10000000)
print("Generator created (no memory allocated yet)")
for i, num in enumerate(large_nums):
    if i >= 3:
        break
    print(num)`,
        console_output: `Created list with 10000000 elements
0
1
4`,
        expected_output: `Generator created (no memory allocated yet)
0
1
4`,
        explanation: "Memory Usage Error - List comprehension creates entire list in memory before returning, causing slow startup and high memory usage. Use generator expression for lazy evaluation that produces values on-demand.",
        hints: "What's the difference between [] and () in comprehensions? When does each one allocate memory?",
        tags: "generators,memory,lazy-evaluation,performance"
      },
      {
        title: "Circular Import Issue",
        description: "These modules have a circular import dependency.",
        difficulty: "hard",
        language: "python",
        buggy_code: `# file1.py
from file2 import func_b

def func_a():
    return func_b() + 1

# file2.py
from file1 import func_a

def func_b():
    return 5

# main.py
from file1 import func_a
print(func_a())`,
        fixed_code: `# file1.py
def func_a():
    from file2 import func_b  # Import inside function
    return func_b() + 1

# file2.py
def func_b():
    return 5

# main.py
from file1 import func_a
print(func_a())`,
        console_output: `ImportError: cannot import name 'func_a' from partially initialized module`,
        expected_output: `6`,
        explanation: "Circular Import Error - Modules importing each other create circular dependency. Move imports inside functions or restructure code.",
        hints: "What happens when two modules try to import each other? How can you break the circular dependency?",
        tags: "imports,circular,modules,dependencies"
      },
      {
        title: "Method Resolution Order",
        description: "This multiple inheritance has method resolution issues.",
        difficulty: "hard",
        language: "python",
        buggy_code: `class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return "B"

class C(A):
    def method(self):
        return "C"

class D(B, C):
    pass

obj = D()
print(obj.method())  # Which method is called?
print(D.__mro__)  # Method Resolution Order`,
        fixed_code: `class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return super().method() + " -> B"

class C(A):
    def method(self):
        return super().method() + " -> C"

class D(B, C):
    def method(self):
        return super().method() + " -> D"

obj = D()
print(obj.method())
print(D.__mro__)`,
        console_output: `B
(<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)`,
        expected_output: `A -> C -> B -> D
(<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)`,
        explanation: "Method Resolution Order - Python uses C3 linearization for multiple inheritance. Understanding MRO helps predict which method gets called.",
        hints: "What is Method Resolution Order? How does Python decide which method to call in multiple inheritance?",
        tags: "inheritance,mro,multiple-inheritance,super"
      },
      {
        title: "Metaclass Confusion",
        description: "This metaclass implementation doesn't work as expected.",
        difficulty: "hard",
        language: "python",
        buggy_code: `class SingletonMeta(type):
    _instance = None

    def __call__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__call__(*args, **kwargs)
        return cls._instance

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connection = "Connected"

class Cache(metaclass=SingletonMeta):
    def __init__(self):
        self.data = {}

# These should be separate singletons but share the same instance!
db1 = Database()
cache1 = Cache()
print("db1 is cache1:", db1 is cache1)
print("Type of db1:", type(db1).__name__)
print("Type of cache1:", type(cache1).__name__)`,
        fixed_code: `class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connection = "Connected"

class Cache(metaclass=SingletonMeta):
    def __init__(self):
        self.data = {}

# Now they are separate singletons
db1 = Database()
cache1 = Cache()
print("db1 is cache1:", db1 is cache1)
print("Type of db1:", type(db1).__name__)
print("Type of cache1:", type(cache1).__name__)`,
        console_output: `db1 is cache1: True
Type of db1: Database
Type of cache1: Database`,
        expected_output: `db1 is cache1: False
Type of db1: Database
Type of cache1: Cache`,
        explanation: "Metaclass Singleton Error - Storing _instance directly on metaclass causes all classes using the metaclass to share the same instance! Use a dictionary keyed by class to store separate instances for each class.",
        hints: "What happens when multiple classes use the same metaclass? How should you store instances separately for each class?",
        tags: "metaclass,singleton,design-patterns,advanced"
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
      {
        title: "Null Pointer Exception",
        description: "This method doesn't handle null input properly.",
        difficulty: "easy",
        language: "java",
        buggy_code: `public class Main {
    public static void processString(String input) {
        System.out.println(input.toUpperCase());
        System.out.println(input.length());
    }

    public static void main(String[] args) {
        processString("hello");
        processString(null);
    }
}`,
        fixed_code: `public class Main {
    public static void processString(String input) {
        if (input != null) {
            System.out.println(input.toUpperCase());
            System.out.println(input.length());
        } else {
            System.out.println("Input is null");
        }
    }

    public static void main(String[] args) {
        processString("hello");
        processString(null);
    }
}`,
        console_output: `HELLO
5
NullPointerException`,
        expected_output: `HELLO
5
Input is null`,
        explanation: "Null Pointer Exception - Calling methods on null reference throws NPE. Always check for null before method calls.",
        hints: "What happens when you call methods on a null reference? How can you check for null first?",
        tags: "null-pointer,validation,defensive-programming"
      },
      {
        title: "Infinite Loop Array",
        description: "This array initialization creates an infinite loop.",
        difficulty: "easy",
        language: "java",
        buggy_code: `public class Main {
    public static void main(String[] args) {
        int[] numbers = new int[5];
        for (int i = 0; i <= numbers.length; i++) {
            numbers[i] = i * 2;
        }

        for (int num : numbers) {
            System.out.println(num);
        }
    }
}`,
        fixed_code: `public class Main {
    public static void main(String[] args) {
        int[] numbers = new int[5];
        for (int i = 0; i < numbers.length; i++) {
            numbers[i] = i * 2;
        }

        for (int num : numbers) {
            System.out.println(num);
        }
    }
}`,
        console_output: `ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5`,
        expected_output: `0
2
4
6
8`,
        explanation: "Array Bounds Error - Using <= in loop condition tries to access index equal to array length, which doesn't exist. Use < instead.",
        hints: "What's the valid range of indices for an array? What does array.length return?",
        tags: "arrays,loops,bounds,indexing"
      },
      {
        title: "Static vs Instance",
        description: "This class confuses static and instance members.",
        difficulty: "easy",
        language: "java",
        buggy_code: `public class Main {
    private int count = 0;

    public static void increment() {
        count++;  // Cannot access instance variable from static method
    }

    public static void main(String[] args) {
        increment();
        System.out.println(count);
    }
}`,
        fixed_code: `public class Main {
    private static int count = 0;  // Make it static

    public static void increment() {
        count++;
    }

    public static void main(String[] args) {
        increment();
        System.out.println(count);
    }
}`,
        console_output: `Compilation error: non-static variable count cannot be referenced from a static context`,
        expected_output: `1`,
        explanation: "Static Context Error - Static methods cannot access instance variables. Make the variable static or create an instance.",
        hints: "What's the difference between static and instance members? How can static methods access data?",
        tags: "static,instance,context,compilation"
      },
      {
        title: "Switch Statement Fall-through",
        description: "This switch statement doesn't work as expected.",
        difficulty: "easy",
        language: "java",
        buggy_code: `public class Main {
    public static String getLetterGrade(int score) {
        String grade;
        switch (score / 10) {
            case 10:
            case 9:
                grade = "A";
            case 8:
                grade = "B";
            case 7:
                grade = "C";
            case 6:
                grade = "D";
            default:
                grade = "F";
        }
        return grade;
    }

    public static void main(String[] args) {
        System.out.println(getLetterGrade(95));
        System.out.println(getLetterGrade(82));
    }
}`,
        fixed_code: `public class Main {
    public static String getLetterGrade(int score) {
        String grade;
        switch (score / 10) {
            case 10:
            case 9:
                grade = "A";
                break;
            case 8:
                grade = "B";
                break;
            case 7:
                grade = "C";
                break;
            case 6:
                grade = "D";
                break;
            default:
                grade = "F";
        }
        return grade;
    }

    public static void main(String[] args) {
        System.out.println(getLetterGrade(95));
        System.out.println(getLetterGrade(82));
    }
}`,
        console_output: `F
F`,
        expected_output: `A
B`,
        explanation: "Switch Fall-through Error - Missing break statements cause execution to continue to subsequent cases. Add break to stop fall-through.",
        hints: "What happens when you don't use break in switch cases? How does fall-through work?",
        tags: "switch,break,fall-through,control-flow"
      },
      {
        title: "ArrayList vs Array",
        description: "This code tries to use ArrayList like an array.",
        difficulty: "medium",
        language: "java",
        buggy_code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list[0] = "apple";  // Cannot use array syntax
        list[1] = "banana";

        System.out.println(list[0]);
    }
}`,
        fixed_code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("apple");
        list.add("banana");

        System.out.println(list.get(0));
    }
}`,
        console_output: `Compilation error: array required, but ArrayList<String> found`,
        expected_output: `apple`,
        explanation: "ArrayList Syntax Error - ArrayList uses add() and get() methods, not array syntax with []. Use proper ArrayList methods.",
        hints: "How do you add elements to ArrayList? How do you access elements by index?",
        tags: "arraylist,methods,syntax,collections"
      },
      {
        title: "Static Block Order",
        description: "This class has static initialization order issues.",
        difficulty: "medium",
        language: "java",
        buggy_code: `public class Main {
    static int x = getValue();
    static int y = 20;

    static {
        System.out.println("Static block: x = " + x + ", y = " + y);
    }

    static int getValue() {
        System.out.println("getValue called: y = " + y);
        return y + 10;
    }

    public static void main(String[] args) {
        System.out.println("Final: x = " + x + ", y = " + y);
    }
}`,
        fixed_code: `public class Main {
    static int y = 20;  // Initialize y first
    static int x = getValue();

    static {
        System.out.println("Static block: x = " + x + ", y = " + y);
    }

    static int getValue() {
        System.out.println("getValue called: y = " + y);
        return y + 10;
    }

    public static void main(String[] args) {
        System.out.println("Final: x = " + x + ", y = " + y);
    }
}`,
        console_output: `getValue called: y = 0
Static block: x = 10, y = 20
Final: x = 10, y = 20`,
        expected_output: `getValue called: y = 20
Static block: x = 30, y = 20
Final: x = 30, y = 20`,
        explanation: "Static Initialization Order - Static variables are initialized in declaration order. Variables used before declaration have default values.",
        hints: "In what order are static variables initialized? What happens when you reference a variable before it's declared?",
        tags: "static,initialization,order,class-loading"
      },
      {
        title: "Overriding vs Overloading",
        description: "This class confuses method overriding and overloading.",
        difficulty: "medium",
        language: "java",
        buggy_code: `class Animal {
    public void makeSound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    public void makeSound(String sound) {  // Overloading, not overriding
        System.out.println("Dog says: " + sound);
    }
}

public class Main {
    public static void main(String[] args) {
        Animal animal = new Dog();
        animal.makeSound();  // Calls Animal version, not Dog
    }
}`,
        fixed_code: `class Animal {
    public void makeSound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() {  // Proper overriding
        System.out.println("Dog says: Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal animal = new Dog();
        animal.makeSound();  // Calls Dog version
    }
}`,
        console_output: `Animal sound`,
        expected_output: `Dog says: Woof!`,
        explanation: "Overriding vs Overloading Error - Method with different parameters is overloading, not overriding. Use same signature to override.",
        hints: "What's the difference between overriding and overloading? How do you properly override a method?",
        tags: "inheritance,overriding,overloading,polymorphism"
      },
      {
        title: "Final Variable Assignment",
        description: "This class tries to modify final variables incorrectly.",
        difficulty: "medium",
        language: "java",
        buggy_code: `public class Main {
    private final int value;
    private final List<String> items = new ArrayList<>();

    public FinalVariable() {
        value = 10;
    }

    public void setValue(int newValue) {
        value = newValue;  // Cannot assign to final variable
    }

    public void modifyList() {
        items = new ArrayList<>();  // Cannot reassign final reference
        items.add("item");  // This would be OK
    }
}`,
        fixed_code: `import java.util.*;

public class Main {
    private final int value;
    private final List<String> items = new ArrayList<>();

    public FinalVariable() {
        value = 10;
    }

    public void setValue(int newValue) {
        // Cannot change final variable - remove this method or change design
        System.out.println("Cannot change final value: " + value);
    }

    public void modifyList() {
        // Cannot reassign final reference, but can modify contents
        items.add("item");
        items.clear();
    }
}`,
        console_output: `Compilation error: cannot assign a value to final variable`,
        expected_output: `Cannot change final value: 10`,
        explanation: "Final Variable Error - Final variables cannot be reassigned after initialization. Final references cannot be changed, but object contents can be modified.",
        hints: "What does final mean for variables? What's the difference between final primitive and final object reference?",
        tags: "final,immutable,references,compilation"
      },
      {
        title: "Checked Exception Handling",
        description: "This method doesn't handle checked exceptions properly.",
        difficulty: "medium",
        language: "java",
        buggy_code: `import java.io.*;

public class Main {
    public static void readFile(String filename) {
        FileReader file = new FileReader(filename);  // Throws IOException
        BufferedReader reader = new BufferedReader(file);
        String line = reader.readLine();
        System.out.println(line);
        reader.close();
    }

    public static void main(String[] args) {
        readFile("test.txt");
    }
}`,
        fixed_code: `import java.io.*;

public class Main {
    public static void readFile(String filename) {
        try {
            FileReader file = new FileReader(filename);
            BufferedReader reader = new BufferedReader(file);
            String line = reader.readLine();
            System.out.println(line);
            reader.close();
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        readFile("test.txt");
    }
}`,
        console_output: `Compilation error: unreported exception IOException; must be caught or declared to be thrown`,
        expected_output: `First line of file or error message`,
        explanation: "Checked Exception Error - IOException must be caught or declared in throws clause. Use try-catch or add throws to method signature.",
        hints: "What are checked exceptions? How must they be handled in Java?",
        tags: "exceptions,checked,IOException,try-catch"
      },
      {
        title: "Generic Wildcard Confusion",
        description: "This generic method has wildcard type issues.",
        difficulty: "hard",
        language: "java",
        buggy_code: `import java.util.*;

public class Main {
    public static void addNumbers(List<? extends Number> list) {
        list.add(42);  // Cannot add to ? extends
        list.add(3.14);
    }

    public static void main(String[] args) {
        List<Integer> integers = new ArrayList<>();
        addNumbers(integers);
        System.out.println(integers);
    }
}`,
        fixed_code: `import java.util.*;

public class Main {
    public static void addNumbers(List<? super Integer> list) {
        list.add(42);  // Can add to ? super
    }

    // Or use specific type
    public static void addNumbersSpecific(List<Number> list) {
        list.add(42);
        list.add(3.14);
    }

    public static void main(String[] args) {
        List<Number> numbers = new ArrayList<>();
        addNumbers(numbers);
        System.out.println(numbers);
    }
}`,
        console_output: `Compilation error: cannot add to List<? extends Number>`,
        expected_output: `[42]`,
        explanation: "Generic Wildcard Error - Cannot add to List<? extends T> due to type safety. Use ? super T for adding, ? extends T for reading.",
        hints: "What's the difference between ? extends and ? super? When can you add elements to generic collections?",
        tags: "generics,wildcards,type-safety,collections"
      },
      {
        title: "Inner Class Access",
        description: "This inner class has access modifier issues.",
        difficulty: "hard",
        language: "java",
        buggy_code: `public class Main {
    private static int staticVar = 10;
    private int instanceVar = 20;

    static class StaticInner {
        public void printVars() {
            System.out.println(staticVar);     // OK
            System.out.println(instanceVar);  // Error: cannot access instance var
        }
    }

    class NonStaticInner {
        public void printVars() {
            System.out.println(staticVar);     // OK
            System.out.println(instanceVar);  // OK
        }
    }

    public static void main(String[] args) {
        StaticInner si = new StaticInner();
        si.printVars();
    }
}`,
        fixed_code: `public class Main {
    private static int staticVar = 10;
    private int instanceVar = 20;

    static class StaticInner {
        public void printVars(Main outer) {
            System.out.println(staticVar);
            System.out.println(outer.instanceVar);  // Access via instance
        }
    }

    class NonStaticInner {
        public void printVars() {
            System.out.println(staticVar);
            System.out.println(instanceVar);
        }
    }

    public static void main(String[] args) {
        Main outer = new Main();
        StaticInner si = new StaticInner();
        si.printVars(outer);
    }
}`,
        console_output: `Compilation error: non-static variable instanceVar cannot be referenced from a static context`,
        expected_output: `10
20`,
        explanation: "Inner Class Access Error - Static nested classes cannot directly access instance variables of outer class. Pass outer instance or use non-static inner class.",
        hints: "What's the difference between static and non-static inner classes? How do they access outer class members?",
        tags: "inner-classes,static,access-modifiers,nested"
      },
      {
        title: "Stream Lazy Evaluation",
        description: "This stream operation doesn't execute as expected.",
        difficulty: "hard",
        language: "java",
        buggy_code: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        Stream<Integer> stream = numbers.stream()
            .filter(n -> {
                System.out.println("Processing: " + n);
                return n % 2 == 0;
            })
            .map(n -> n * 2);

        System.out.println("Stream created");
        // No terminal operation - nothing happens!
    }
}`,
        fixed_code: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        List<Integer> result = numbers.stream()
            .filter(n -> {
                System.out.println("Processing: " + n);
                return n % 2 == 0;
            })
            .map(n -> n * 2)
            .collect(Collectors.toList());  // Terminal operation

        System.out.println("Stream created");
        System.out.println("Result: " + result);
    }
}`,
        console_output: `Stream created`,
        expected_output: `Processing: 1
Processing: 2
Processing: 3
Processing: 4
Processing: 5
Stream created
Result: [4, 8]`,
        explanation: "Stream Lazy Evaluation - Streams are lazy and only execute when a terminal operation is called. Add terminal operation like collect().",
        hints: "When do stream operations actually execute? What are terminal vs intermediate operations?",
        tags: "streams,lazy-evaluation,terminal-operations,functional"
      },

      // JavaScript Questions (runnable without judge0)
      {
        title: "Variable Hoisting Confusion",
        description: "This JavaScript function has unexpected variable behavior.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `function confusingFunction() {
    console.log(y);  // ReferenceError - variable not declared at all
    y = 5;  // Assignment without declaration
    console.log(y);
}

confusingFunction();`,
        fixed_code: `function confusingFunction() {
    var y;           // Proper declaration
    console.log(y);  // undefined
    y = 5;           // Assignment
    console.log(y);  // 5
}

confusingFunction();`,
        console_output: `ReferenceError: y is not defined`,
        expected_output: `undefined
5`,
        explanation: "Variable Declaration Error - Assigning to a variable without declaring it (no var/let/const) in strict mode or function scope causes ReferenceError. Always declare variables before use.",
        hints: "What happens when you use a variable without declaring it? How does this differ from var hoisting?",
        tags: "hoisting,var,scope,undefined,reference-error"
      },
      {
        title: "This Binding Issue",
        description: "This method loses its context when passed as callback.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `const person = {
    name: "Alice",
    greet: function() {
        console.log("Hello, " + this.name);
    }
};

const greetFunction = person.greet;
greetFunction();  // 'this' is undefined/window`,
        fixed_code: `const person = {
    name: "Alice",
    greet: function() {
        console.log("Hello, " + this.name);
    }
};

const greetFunction = person.greet.bind(person);
greetFunction();  // 'this' is properly bound`,
        console_output: `Hello, undefined`,
        expected_output: `Hello, Alice`,
        explanation: "This Binding Error - When method is extracted from object, 'this' context is lost. Use bind() to preserve context.",
        hints: "What happens to 'this' when you extract a method from an object? How can you preserve the context?",
        tags: "this,binding,context,methods"
      },
      {
        title: "Closure Loop Problem",
        description: "This loop with setTimeout doesn't work as expected.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);  // All print 3
    }, 100);
}`,
        fixed_code: `// Solution 1: Use let instead of var
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);  // Prints 0, 1, 2
    }, 100);
}

// Solution 2: Use closure
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(j);
        }, 100);
    })(i);
}`,
        console_output: `3
3
3`,
        expected_output: `0
1
2`,
        explanation: "Closure Loop Problem - var creates function-scoped variable shared by all callbacks. Use let for block scope or IIFE for closure.",
        hints: "What's the difference between var and let in loops? How do closures capture variables?",
        tags: "closures,loops,var,let,setTimeout"
      },
      {
        title: "Array Map Side Effects",
        description: "This array processing modifies the original array incorrectly.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

const updatedUsers = users.map(user => {
    user.age += 1;  // Modifies original object!
    return user;
});

console.log("Original:", users);
console.log("Updated:", updatedUsers);`,
        fixed_code: `const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

const updatedUsers = users.map(user => {
    return { ...user, age: user.age + 1 };  // Create new object
});

console.log("Original:", users);
console.log("Updated:", updatedUsers);`,
        console_output: `Original: [{ name: "Alice", age: 26 }, { name: "Bob", age: 31 }]
Updated: [{ name: "Alice", age: 26 }, { name: "Bob", age: 31 }]`,
        expected_output: `Original: [{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }]
Updated: [{ name: "Alice", age: 26 }, { name: "Bob", age: 31 }]`,
        explanation: "Array Map Side Effects - Objects are passed by reference. Modifying objects in map affects original array. Create new objects instead.",
        hints: "What happens when you modify objects in array methods? How can you avoid side effects?",
        tags: "arrays,map,side-effects,objects,immutability"
      },
      {
        title: "Async Function Confusion",
        description: "This async function doesn't wait for promises properly.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `async function fetchData() {
    const urls = ['url1', 'url2', 'url3'];
    const results = [];

    urls.forEach(url => {
        const data = fetch(url);  // Missing await
        results.push(data);       // Pushes Promise objects
    });

    return results;
}

fetchData().then(console.log);  // Array of Promises`,
        fixed_code: `async function fetchData() {
    const urls = ['url1', 'url2', 'url3'];
    const results = [];

    for (const url of urls) {
        const data = await fetch(url);  // Await each fetch
        results.push(data);
    }

    return results;
}

// Or use Promise.all for parallel execution
async function fetchDataParallel() {
    const urls = ['url1', 'url2', 'url3'];
    const promises = urls.map(url => fetch(url));
    return await Promise.all(promises);
}`,
        console_output: `[Promise, Promise, Promise]`,
        expected_output: `[Response, Response, Response]`,
        explanation: "Async/Await Error - forEach doesn't wait for async operations. Use for...of with await or Promise.all for parallel execution.",
        hints: "Why doesn't forEach work with async/await? How can you handle multiple async operations?",
        tags: "async,await,promises,forEach,loops"
      },
      {
        title: "Object Property Deletion",
        description: "This code tries to delete object properties incorrectly.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `const config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    debug: true
};

// Trying to remove debug property
config.debug = null;  // Sets to null, doesn't remove
console.log(config);
console.log('debug' in config);  // Still true!`,
        fixed_code: `const config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    debug: true
};

// Properly remove debug property
delete config.debug;
console.log(config);
console.log('debug' in config);  // Now false`,
        console_output: `{ apiUrl: 'https://api.example.com', timeout: 5000, debug: null }
true`,
        expected_output: `{ apiUrl: 'https://api.example.com', timeout: 5000 }
false`,
        explanation: "Object Property Deletion - Setting property to null/undefined doesn't remove it. Use delete operator to actually remove properties.",
        hints: "What's the difference between setting a property to null and deleting it? How do you check if a property exists?",
        tags: "objects,properties,delete,null,undefined"
      },
      {
        title: "Type Coercion Surprise",
        description: "This comparison behaves unexpectedly due to type coercion.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `function checkValue(input) {
    if (input == true) {        // Loose equality
        console.log("Truthy!");
    } else {
        console.log("Falsy!");
    }
}

checkValue(1);      // What happens?
checkValue("1");    // What happens?
checkValue(2);      // What happens?`,
        fixed_code: `function checkValue(input) {
    if (input === true) {       // Strict equality
        console.log("Exactly true!");
    } else if (input) {         // Just check truthiness
        console.log("Truthy!");
    } else {
        console.log("Falsy!");
    }
}

checkValue(1);      // Truthy!
checkValue("1");    // Truthy!
checkValue(2);      // Truthy!
checkValue(true);   // Exactly true!`,
        console_output: `Truthy!
Truthy!
Falsy!`,
        expected_output: `Truthy!
Truthy!
Truthy!`,
        explanation: "Type Coercion Error - == performs type coercion which can be confusing. Use === for strict equality or just check truthiness.",
        hints: "What's the difference between == and ===? How does JavaScript convert types in comparisons?",
        tags: "type-coercion,equality,comparison,truthy,falsy"
      },
      {
        title: "Array vs Object Destructuring",
        description: "This destructuring syntax is incorrect for the data type.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `const userData = { name: "Alice", age: 25, city: "NYC" };

// Wrong: using array destructuring for object
const [name, age, city] = userData;

console.log(name, age, city);`,
        fixed_code: `const userData = { name: "Alice", age: 25, city: "NYC" };

// Correct: using object destructuring
const { name, age, city } = userData;

console.log(name, age, city);`,
        console_output: `undefined undefined undefined`,
        expected_output: `Alice 25 NYC`,
        explanation: "Destructuring Syntax Error - Use {} for object destructuring and [] for array destructuring. Match the syntax to your data type.",
        hints: "What's the difference between array and object destructuring syntax? When do you use each?",
        tags: "destructuring,objects,arrays,syntax"
      },
      {
        title: "Function Declaration vs Expression",
        description: "This code has function timing issues due to hoisting.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `console.log(declaredFunction()); // Works
console.log(expressedFunction()); // Error!

function declaredFunction() {
    return "I'm hoisted!";
}

var expressedFunction = function() {
    return "I'm not hoisted!";
};`,
        fixed_code: `// Function declarations are hoisted
function declaredFunction() {
    return "I'm hoisted!";
}

// Function expressions are not hoisted
var expressedFunction = function() {
    return "I'm not hoisted!";
};

console.log(declaredFunction()); // Works
console.log(expressedFunction()); // Now works`,
        console_output: `I'm hoisted!
TypeError: expressedFunction is not a function`,
        expected_output: `I'm hoisted!
I'm not hoisted!`,
        explanation: "Function Hoisting Error - Function declarations are hoisted, but function expressions are not. Call functions after they're defined if using expressions.",
        hints: "What's the difference between function declarations and expressions? Which ones are hoisted?",
        tags: "functions,hoisting,declaration,expression"
      },
      {
        title: "Event Loop and SetTimeout",
        description: "This code tries to make setTimeout work synchronously.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `let result = null;

console.log("Start");

setTimeout(() => {
    result = "Data loaded";
}, 0);

// Try to use result immediately - but it's still null!
console.log("Result:", result);
console.log("End");`,
        fixed_code: `let result = null;

console.log("Start");

setTimeout(() => {
    result = "Data loaded";
    console.log("Result:", result);  // Use result in callback
    console.log("End");  // Continue execution here
}, 0);

// Can't use result here - it's still null`,
        console_output: `Start
Result: null
End`,
        expected_output: `Start
Result: Data loaded
End`,
        explanation: "Event Loop Async Error - setTimeout callbacks execute after current code finishes, even with 0ms delay. You cannot use setTimeout's result synchronously. Use callbacks, promises, or async/await instead.",
        hints: "When does a setTimeout callback actually execute? Can you access its result immediately after calling setTimeout?",
        tags: "event-loop,setTimeout,asynchronous,timing,callbacks"
      },
      {
        title: "Object Mutation in Functions",
        description: "This function unexpectedly modifies the original object.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `function updateUser(user) {
    user.lastLogin = new Date();
    user.loginCount++;
    return user;
}

const originalUser = { name: "Alice", loginCount: 5 };
const updatedUser = updateUser(originalUser);

console.log("Original:", originalUser);
console.log("Updated:", updatedUser);
console.log("Same object?", originalUser === updatedUser);`,
        fixed_code: `function updateUser(user) {
    return {
        ...user,
        lastLogin: new Date(),
        loginCount: user.loginCount + 1
    };
}

const originalUser = { name: "Alice", loginCount: 5 };
const updatedUser = updateUser(originalUser);

console.log("Original:", originalUser);
console.log("Updated:", updatedUser);
console.log("Same object?", originalUser === updatedUser);`,
        console_output: `Original: { name: "Alice", loginCount: 6, lastLogin: [Date] }
Updated: { name: "Alice", loginCount: 6, lastLogin: [Date] }
Same object? true`,
        expected_output: `Original: { name: "Alice", loginCount: 5 }
Updated: { name: "Alice", loginCount: 6, lastLogin: [Date] }
Same object? false`,
        explanation: "Object Mutation Error - Objects are passed by reference. Modifying the parameter affects the original. Create a new object to avoid mutation.",
        hints: "How are objects passed to functions in JavaScript? How can you avoid modifying the original object?",
        tags: "objects,mutation,reference,spread-operator"
      },
      {
        title: "String vs Number Addition",
        description: "This calculation gives unexpected results due to type coercion.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `function calculateTotal(price, tax) {
    return price + tax;
}

const result1 = calculateTotal(10, 2);
const result2 = calculateTotal("10", 2);
const result3 = calculateTotal("10", "2");

console.log("Result 1:", result1);
console.log("Result 2:", result2);
console.log("Result 3:", result3);`,
        fixed_code: `function calculateTotal(price, tax) {
    return Number(price) + Number(tax);
    // Or: return parseFloat(price) + parseFloat(tax);
}

const result1 = calculateTotal(10, 2);
const result2 = calculateTotal("10", 2);
const result3 = calculateTotal("10", "2");

console.log("Result 1:", result1);
console.log("Result 2:", result2);
console.log("Result 3:", result3);`,
        console_output: `Result 1: 12
Result 2: 102
Result 3: 102`,
        expected_output: `Result 1: 12
Result 2: 12
Result 3: 12`,
        explanation: "Type Coercion Error - JavaScript concatenates strings when using +. Convert strings to numbers explicitly before mathematical operations.",
        hints: "What happens when you use + with strings and numbers? How can you ensure numeric addition?",
        tags: "type-coercion,strings,numbers,addition"
      },
      {
        title: "Array Filter Misuse",
        description: "This array filtering doesn't work as expected.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `const numbers = [1, 2, 3, 4, 5, 6];

// Trying to filter out even numbers (keep odd)
numbers.filter(num => {
    if (num % 2 !== 0) {
        return num;  // Wrong! Should return boolean
    }
});

console.log(numbers);  // Original array unchanged`,
        fixed_code: `const numbers = [1, 2, 3, 4, 5, 6];

// Correct: filter returns boolean, creates new array
const oddNumbers = numbers.filter(num => num % 2 !== 0);

console.log("Original:", numbers);
console.log("Filtered:", oddNumbers);`,
        console_output: `[1, 2, 3, 4, 5, 6]`,
        expected_output: `Original: [1, 2, 3, 4, 5, 6]
Filtered: [1, 3, 5]`,
        explanation: "Array Filter Error - filter() expects boolean return value and creates new array. It doesn't modify the original array.",
        hints: "What should filter callback return? Does filter modify the original array?",
        tags: "arrays,filter,methods,return-values"
      },
      {
        title: "Promise Chain Error Handling",
        description: "This promise chain doesn't handle errors properly.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `fetch('/api/user')
    .then(response => response.json())
    .then(user => {
        console.log(user.name.toUpperCase());  // What if name is null?
        return fetch('/api/posts/' + user.id);
    })
    .then(response => response.json())
    .then(posts => {
        console.log("Posts:", posts);
    });
// No error handling - crashes on any error`,
        fixed_code: `fetch('/api/user')
    .then(response => {
        if (!response.ok) throw new Error('User fetch failed');
        return response.json();
    })
    .then(user => {
        if (!user.name) throw new Error('User name missing');
        console.log(user.name.toUpperCase());
        return fetch('/api/posts/' + user.id);
    })
    .then(response => {
        if (!response.ok) throw new Error('Posts fetch failed');
        return response.json();
    })
    .then(posts => {
        console.log("Posts:", posts);
    })
    .catch(error => {
        console.error("Error:", error.message);
    });`,
        console_output: `TypeError: Cannot read property 'toUpperCase' of null`,
        expected_output: `Error: User name missing`,
        explanation: "Promise Error Handling - Always add .catch() for error handling and validate data before using it. Check for null/undefined values.",
        hints: "How do you handle errors in promise chains? What happens when you don't validate data?",
        tags: "promises,error-handling,validation,fetch"
      },
      {
        title: "Arrow Function This Context",
        description: "This arrow function doesn't have the expected 'this' binding.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `const timer = {
    seconds: 0,
    start: function() {
        setInterval(() => {
            this.seconds++;  // 'this' refers to timer object
            console.log(this.seconds);
        }, 1000);
    },
    reset: () => {
        this.seconds = 0;  // 'this' refers to global object!
        console.log("Reset to:", this.seconds);
    }
};

timer.start();
setTimeout(() => timer.reset(), 3000);`,
        fixed_code: `const timer = {
    seconds: 0,
    start: function() {
        setInterval(() => {
            this.seconds++;  // 'this' refers to timer object
            console.log(this.seconds);
        }, 1000);
    },
    reset: function() {  // Regular function to bind 'this'
        this.seconds = 0;
        console.log("Reset to:", this.seconds);
    }
};

timer.start();
setTimeout(() => timer.reset(), 3000);`,
        console_output: `1
2
3
Reset to: undefined`,
        expected_output: `1
2
3
Reset to: 0`,
        explanation: "Arrow Function This Binding - Arrow functions don't have their own 'this'. Use regular functions for methods that need 'this' context.",
        hints: "How does 'this' work in arrow functions vs regular functions? When should you use each?",
        tags: "arrow-functions,this,binding,context"
      },
      {
        title: "JSON Parse Error Handling",
        description: "This JSON parsing can crash the application.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `function processApiResponse(jsonString) {
    const data = JSON.parse(jsonString);
    console.log("User:", data.user.name);
    return data;
}

// These will crash the application
processApiResponse('{"user": {"name": "Alice"}}');  // Works
processApiResponse('invalid json');  // Crashes!
processApiResponse('{"user": null}');  // Crashes!`,
        fixed_code: `function processApiResponse(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        if (data.user && data.user.name) {
            console.log("User:", data.user.name);
        } else {
            console.log("User data incomplete");
        }
        return data;
    } catch (error) {
        console.error("Invalid JSON:", error.message);
        return null;
    }
}

processApiResponse('{"user": {"name": "Alice"}}');  // Works
processApiResponse('invalid json');  // Handled gracefully
processApiResponse('{"user": null}');  // Handled gracefully`,
        console_output: `User: Alice
SyntaxError: Unexpected token i in JSON
TypeError: Cannot read property 'name' of null`,
        expected_output: `User: Alice
Invalid JSON: Unexpected token i in JSON
User data incomplete`,
        explanation: "JSON Parse Error - JSON.parse() throws errors on invalid JSON. Always wrap in try-catch and validate parsed data structure.",
        hints: "What happens when JSON.parse receives invalid JSON? How should you handle nested object access?",
        tags: "json,parsing,error-handling,validation"
      },
      {
        title: "Template Literal Scope Issue",
        description: "This template literal has variable scope problems.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `function createMessages() {
    const messages = [];

    for (var i = 0; i < 3; i++) {
        messages.push(\`Message number \${i}\`);
    }

    console.log(\`Final i value: \${i}\`);  // i is still accessible!
    return messages;
}

const result = createMessages();
console.log(result);`,
        fixed_code: `function createMessages() {
    const messages = [];

    for (let i = 0; i < 3; i++) {  // Use let for block scope
        messages.push(\`Message number \${i}\`);
    }

    // console.log(\`Final i value: \${i}\`);  // Error: i not defined
    return messages;
}

const result = createMessages();
console.log(result);`,
        console_output: `Final i value: 3
["Message number 0", "Message number 1", "Message number 2"]`,
        expected_output: `["Message number 0", "Message number 1", "Message number 2"]`,
        explanation: "Variable Scope Error - var has function scope and remains accessible after loop. Use let for block scope to prevent variable leakage.",
        hints: "What's the scope difference between var and let? Should loop variables be accessible outside the loop?",
        tags: "template-literals,scope,var,let,loops"
      },
      {
        title: "Default Parameter Side Effects",
        description: "This default parameter has unexpected behavior.",
        difficulty: "medium",
        language: "javascript",
        buggy_code: `function addToList(item, list = []) {
    list.push(item);
    return list;
}

console.log(addToList("apple"));     // ["apple"]
console.log(addToList("banana"));    // ["apple", "banana"] - Shared array!
console.log(addToList("cherry"));    // ["apple", "banana", "cherry"]`,
        fixed_code: `function addToList(item, list = null) {
    const targetList = list || [];  // Create new array if none provided
    targetList.push(item);
    return targetList;
}

// Or better yet:
function addToListBetter(item, list) {
    const targetList = list ? [...list] : [];  // Always create new array
    targetList.push(item);
    return targetList;
}

console.log(addToList("apple"));     // ["apple"]
console.log(addToList("banana"));    // ["banana"]
console.log(addToList("cherry"));    // ["cherry"]`,
        console_output: `["apple"]
["apple", "banana"]
["apple", "banana", "cherry"]`,
        expected_output: `["apple"]
["banana"]
["cherry"]`,
        explanation: "Default Parameter Mutation - Default object/array parameters are shared between function calls. Create new instances inside the function.",
        hints: "What happens to default parameters between function calls? How can you avoid shared mutable defaults?",
        tags: "default-parameters,mutation,arrays,side-effects"
      },
      {
        title: "Truthy/Falsy Comparison Edge Case",
        description: "This validation has truthy/falsy edge cases.",
        difficulty: "easy",
        language: "javascript",
        buggy_code: `function validateInput(value) {
    if (value) {
        console.log("Valid input:", value);
        return true;
    } else {
        console.log("Invalid input");
        return false;
    }
}

validateInput("hello");    // Valid
validateInput(42);         // Valid
validateInput(0);          // Invalid? (but 0 might be valid)
validateInput("");         // Invalid? (but empty string might be valid)
validateInput(false);      // Invalid? (but false might be valid)`,
        fixed_code: `function validateInput(value) {
    if (value !== null && value !== undefined) {
        console.log("Valid input:", value);
        return true;
    } else {
        console.log("Invalid input");
        return false;
    }
}

// Or be more specific about what you consider valid
function validateInputSpecific(value) {
    if (typeof value === 'string' && value.length >= 0) {
        console.log("Valid string:", value);
        return true;
    } else if (typeof value === 'number') {
        console.log("Valid number:", value);
        return true;
    } else {
        console.log("Invalid input");
        return false;
    }
}`,
        console_output: `Valid input: hello
Valid input: 42
Invalid input
Invalid input
Invalid input`,
        expected_output: `Valid input: hello
Valid input: 42
Valid input: 0
Valid input:
Valid input: false`,
        explanation: "Truthy/Falsy Validation Error - Many valid values are falsy (0, '', false). Be explicit about what you consider invalid instead of relying on truthiness.",
        hints: "Which values are falsy in JavaScript? Are all falsy values actually invalid for your use case?",
        tags: "truthy,falsy,validation,edge-cases"
      },
      {
        title: "Memory Leak with Event Listeners",
        description: "This code creates memory leaks with event listeners.",
        difficulty: "hard",
        language: "javascript",
        buggy_code: `function createButton(container) {
    const button = document.createElement('button');
    button.textContent = 'Click me';

    // Memory leak: closure holds reference to container
    button.addEventListener('click', function() {
        console.log('Button clicked in', container.id);
        // Even if container is removed from DOM,
        // this listener prevents garbage collection
    });

    container.appendChild(button);
    return button;
}

// Usage that creates memory leaks
const container1 = document.createElement('div');
container1.id = 'container1';
createButton(container1);

// Later: remove container but listener still holds reference
container1.remove();  // Memory leak!`,
        fixed_code: `function createButton(container) {
    const button = document.createElement('button');
    button.textContent = 'Click me';
    const containerId = container.id;  // Store only what we need

    // Better: don't capture entire container
    function handleClick() {
        console.log('Button clicked in', containerId);
    }

    button.addEventListener('click', handleClick);

    // Cleanup function to prevent memory leaks
    button.cleanup = function() {
        button.removeEventListener('click', handleClick);
    };

    container.appendChild(button);
    return button;
}

// Usage with proper cleanup
const container1 = document.createElement('div');
container1.id = 'container1';
const button1 = createButton(container1);

// Later: proper cleanup before removal
button1.cleanup();
container1.remove();  // No memory leak`,
        console_output: `Button clicked in container1
// Memory leak occurs silently`,
        expected_output: `Button clicked in container1
// No memory leak with proper cleanup`,
        explanation: "Memory Leak Error - Event listeners can create memory leaks when they hold references to DOM elements. Remove listeners before removing elements.",
        hints: "How do event listeners affect garbage collection? What happens when you remove DOM elements with attached listeners?",
        tags: "memory-leaks,event-listeners,dom,cleanup,garbage-collection"
      },

      // Additional Java question to reach 20
      {
        title: "Thread Safety Issue",
        description: "This counter class is not thread-safe.",
        difficulty: "hard",
        language: "java",
        buggy_code: `public class Main {
    private int count = 0;

    public void increment() {
        count++;  // Not atomic - can cause race conditions
    }

    public int getCount() {
        return count;
    }

    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();

        // Create multiple threads incrementing the counter
        Thread[] threads = new Thread[10];
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }

        // Wait for all threads to complete
        for (Thread thread : threads) {
            thread.join();
        }

        System.out.println("Expected: 10000, Actual: " + counter.getCount());
    }
}`,
        fixed_code: `public class Main {
    private volatile int count = 0;  // Volatile for visibility
    private final Object lock = new Object();

    public void increment() {
        synchronized (lock) {  // Synchronize for thread safety
            count++;
        }
    }

    // Or use AtomicInteger for better performance
    // private AtomicInteger count = new AtomicInteger(0);
    // public void increment() { count.incrementAndGet(); }

    public int getCount() {
        synchronized (lock) {
            return count;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();

        Thread[] threads = new Thread[10];
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }

        for (Thread thread : threads) {
            thread.join();
        }

        System.out.println("Expected: 10000, Actual: " + counter.getCount());
    }
}`,
        console_output: `Expected: 10000, Actual: 9847 (or other incorrect value)`,
        expected_output: `Expected: 10000, Actual: 10000`,
        explanation: "Thread Safety Error - count++ is not atomic and causes race conditions in multithreaded environment. Use synchronization or AtomicInteger.",
        hints: "Why is count++ not thread-safe? How can you make operations atomic in multithreaded code?",
        tags: "concurrency,thread-safety,synchronization,race-conditions"
      },

    ];