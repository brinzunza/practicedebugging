import initSqlJs from 'sql.js'

class SQLService {
  constructor() {
    this.SQL = null
    this.isLoading = false
  }

  async initSQL() {
    if (this.SQL) return this.SQL
    if (this.isLoading) {
      // Wait for existing load to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return this.SQL
    }

    this.isLoading = true
    try {
      console.log('Initializing SQL.js...')
      this.SQL = await initSqlJs({
        // Use CDN for WASM file
        locateFile: file => `https://sql.js.org/dist/${file}`
      })
      console.log('SQL.js initialized successfully')
      return this.SQL
    } catch (error) {
      console.error('Failed to initialize SQL.js:', error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  async executeSQL(query, schema = null) {
    try {
      const SQL = await this.initSQL()

      // Create new database instance
      const db = new SQL.Database()

      // Set up schema if provided
      if (schema) {
        console.log('Setting up database schema...')
        try {
          db.run(schema)
        } catch (error) {
          console.error('Schema setup error:', error)
          throw new Error(`Schema Error: ${error.message}`)
        }
      }

      // Execute the user query
      console.log('Executing SQL query:', query)
      const results = db.exec(query)

      // Format results for display
      const output = this.formatResults(results)

      // Clean up
      db.close()

      return output
    } catch (error) {
      console.error('SQL execution error:', error)
      if (error.message.includes('Schema Error')) {
        throw error
      }
      throw new Error(`SQL Error: ${error.message}`)
    }
  }

  formatResults(results) {
    if (!results || results.length === 0) {
      return 'Query executed successfully (no results returned)'
    }

    let output = ''

    results.forEach((result, index) => {
      if (index > 0) output += '\n\n'

      const { columns, values } = result

      if (values.length === 0) {
        output += `Query ${index + 1}: No rows returned`
        return
      }

      // Create table header
      const header = columns.join(' | ')
      const separator = columns.map(col => '-'.repeat(col.length)).join('-+-')

      output += header + '\n'
      output += separator + '\n'

      // Add data rows
      values.forEach(row => {
        const formattedRow = row.map((cell, i) => {
          const cellStr = cell === null ? 'NULL' : String(cell)
          return cellStr.padEnd(columns[i].length)
        }).join(' | ')
        output += formattedRow + '\n'
      })

      // Add summary
      output += `\n(${values.length} row${values.length !== 1 ? 's' : ''})`
    })

    return output
  }

  // Predefined schemas for different SQL questions
  getSchema(schemaType) {
    const schemas = {
      employees: `
        CREATE TABLE employees (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          department TEXT NOT NULL,
          salary INTEGER NOT NULL,
          hire_date TEXT NOT NULL,
          manager_id INTEGER
        );

        INSERT INTO employees (id, name, department, salary, hire_date, manager_id) VALUES
        (1, 'John Doe', 'IT', 75000, '2020-01-15', 5),
        (2, 'Jane Smith', 'IT', 80000, '2019-03-22', 5),
        (3, 'Bob Johnson', 'Sales', 65000, '2021-06-10', 6),
        (4, 'Alice Brown', 'HR', 70000, '2020-09-05', NULL),
        (5, 'Charlie Wilson', 'IT', 85000, '2018-11-30', NULL),
        (6, 'Diana Lee', 'Sales', 72000, '2021-02-14', NULL);
      `,

      products: `
        CREATE TABLE products (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          stock INTEGER NOT NULL
        );

        INSERT INTO products (id, name, category, price, stock) VALUES
        (1, 'Laptop', 'Electronics', 999.99, 50),
        (2, 'Mouse', 'Electronics', 25.99, 200),
        (3, 'Keyboard', 'Electronics', 79.99, 150),
        (4, 'Monitor', 'Electronics', 299.99, 75),
        (5, 'Chair', 'Furniture', 199.99, 30),
        (6, 'Desk', 'Furniture', 399.99, 25);
      `,

      customers_orders: `
        CREATE TABLE customers (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          city TEXT NOT NULL
        );

        CREATE TABLE orders (
          id INTEGER PRIMARY KEY,
          customer_id INTEGER,
          order_date TEXT NOT NULL,
          total DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (customer_id) REFERENCES customers(id)
        );

        INSERT INTO customers (id, name, email, city) VALUES
        (1, 'John Smith', 'john@email.com', 'New York'),
        (2, 'Sarah Johnson', 'sarah@email.com', 'Los Angeles'),
        (3, 'Mike Brown', 'mike@email.com', 'Chicago'),
        (4, 'Lisa Davis', 'lisa@email.com', 'Houston');

        INSERT INTO orders (id, customer_id, order_date, total) VALUES
        (1, 1, '2023-01-15', 299.99),
        (2, 1, '2023-02-20', 149.99),
        (3, 2, '2023-01-30', 399.99),
        (4, 3, '2023-03-05', 199.99),
        (5, 2, '2023-03-10', 249.99);
      `,

      users: `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          user_name TEXT NOT NULL,
          email_address TEXT NOT NULL,
          created_date TEXT NOT NULL,
          active INTEGER DEFAULT 1
        );

        INSERT INTO users (id, user_name, email_address, created_date, active) VALUES
        (1, 'john_doe', 'john@example.com', '2023-01-15', 1),
        (2, 'jane_smith', 'jane@example.com', '2023-02-20', 1),
        (3, 'bob_johnson', 'bob@example.com', '2023-03-10', 0),
        (4, 'alice_brown', 'alice@example.com', '2023-04-05', 1),
        (5, 'charlie_wilson', 'charlie@example.com', '2023-05-12', 0);
      `,

      users_products: `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          active INTEGER DEFAULT 1
        );

        CREATE TABLE products (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category TEXT NOT NULL
        );

        CREATE TABLE user_purchases (
          id INTEGER PRIMARY KEY,
          user_id INTEGER,
          product_id INTEGER,
          purchase_date TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        );

        INSERT INTO users (id, name, email, active) VALUES
        (1, 'John Doe', 'john@example.com', 1),
        (2, 'Jane Smith', 'jane@example.com', 1),
        (3, 'Bob Johnson', 'bob@example.com', 0);

        INSERT INTO products (id, title, price, category) VALUES
        (1, 'Laptop', 999.99, 'Electronics'),
        (2, 'Mouse', 29.99, 'Electronics'),
        (3, 'Keyboard', 79.99, 'Electronics');

        INSERT INTO user_purchases (id, user_id, product_id, purchase_date) VALUES
        (1, 1, 1, '2023-01-15'),
        (2, 1, 2, '2023-01-16'),
        (3, 2, 3, '2023-02-10');
      `,

      employee_hierarchy: `
        CREATE TABLE employees (
          employee_id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          manager_id INTEGER,
          department TEXT NOT NULL,
          salary INTEGER NOT NULL,
          hire_date TEXT NOT NULL
        );

        INSERT INTO employees (employee_id, name, manager_id, department, salary, hire_date) VALUES
        (1, 'CEO', NULL, 'Executive', 200000, '2020-01-01'),
        (2, 'VP Engineering', 1, 'Engineering', 150000, '2020-02-01'),
        (3, 'VP Sales', 1, 'Sales', 140000, '2020-02-01'),
        (4, 'Senior Developer', 2, 'Engineering', 120000, '2020-03-01'),
        (5, 'Junior Developer', 4, 'Engineering', 80000, '2021-01-01'),
        (6, 'Sales Manager', 3, 'Sales', 90000, '2020-04-01'),
        (7, 'Sales Rep', 6, 'Sales', 60000, '2021-02-01');
      `
    }

    return schemas[schemaType] || null
  }
}

// Singleton instance
export const sqlService = new SQLService()
export default sqlService