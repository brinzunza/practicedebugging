import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Lightbulb, Target, Search, Wrench, Brain, BookOpen } from 'lucide-react'
import DebugChecklist from './DebugChecklist'

const debuggingContent = {
  "methodology": {
    title: "The DEBUG.EXE Methodology",
    icon: Target,
    sections: [
      {
        title: "The 7-Step Debugging Process",
        content: `
**D** - Define the problem clearly
**E** - Examine the symptoms and error messages  
**B** - Break down the code into smaller parts
**U** - Understand the expected vs actual behavior
**G** - Generate hypotheses about the cause

**E** - Execute tests to validate hypotheses
**X** - eXterminate the bug and verify the fix
**E** - Ensure no new bugs were introduced

This systematic approach ensures you don't miss critical steps and helps build debugging intuition.
        `
      },
      {
        title: "The Scientific Method for Debugging",
        content: `
**1. Observation**: What exactly is happening? What are the symptoms?
**2. Question**: Why is this happening? What could cause this behavior?
**3. Hypothesis**: Form educated guesses about the root cause
**4. Experiment**: Test your hypotheses systematically
**5. Analysis**: Evaluate results and form new hypotheses if needed
**6. Conclusion**: Implement the fix and verify it works

This approach prevents random code changes and builds systematic problem-solving skills.
        `
      }
    ]
  },
  "techniques": {
    title: "Advanced Debugging Techniques",
    icon: Wrench,
    sections: [
      {
        title: "Rubber Duck Debugging",
        content: `
Explain your code line-by-line to an inanimate object (rubber duck, teddy bear, etc.).

**Why it works**:
• Forces you to articulate your assumptions
• Often reveals logical flaws in your thinking
• Slows down your thought process to catch details
• No judgment from the "listener"

**How to do it**:
1. Start from the beginning of the function/module
2. Explain what each line should do
3. Explain what you think is actually happening
4. When you can't explain something clearly, you've found your bug
        `
      },
      {
        title: "Binary Search Debugging",
        content: `
Divide and conquer approach to isolate bugs in large codebases.

**Process**:
1. Identify the range where the bug could exist
2. Test the middle point of that range
3. Determine if the bug is before or after the middle
4. Repeat until you narrow down to the exact location

**Applications**:
• Git bisect for regression bugs
• Commenting out half the code to isolate issues  
• Adding print statements at midpoints
• Testing with simplified data sets
        `
      },
      {
        title: "State Inspection Techniques",
        content: `
**Logging & Print Debugging**:
• Log variable values at key points
• Log function entry/exit points
• Use structured logging (JSON format)
• Log the call stack and context

**Breakpoint Strategies**:
• Set conditional breakpoints
• Use watchpoints for variable changes
• Set breakpoints in exception handlers
• Use temporary breakpoints for one-time checks

**Memory & Performance Debugging**:
• Profile memory usage patterns
• Monitor garbage collection behavior
• Track resource allocation/deallocation
• Measure execution time of code segments
        `
      }
    ]
  },
  "patterns": {
    title: "Common Bug Patterns & Solutions",
    icon: Search,
    sections: [
      {
        title: "Logic Errors",
        content: `
**Symptoms**: Wrong output, unexpected behavior, incorrect calculations

**Common Causes**:
• Off-by-one errors in loops
• Wrong comparison operators (= vs ==)
• Incorrect logical operators (& vs &&)
• Missing edge case handling

**Debugging Approach**:
1. Trace through the logic manually with sample data
2. Add assertions to verify assumptions
3. Test boundary conditions explicitly
4. Use unit tests to verify each logical step
        `
      },
      {
        title: "Race Conditions & Concurrency",
        content: `
**Symptoms**: Intermittent failures, non-reproducible bugs, deadlocks

**Common Causes**:
• Unsynchronized access to shared resources
• Incorrect lock ordering
• Missing volatile/atomic operations
• Callback hell and async/await issues

**Debugging Approach**:
1. Use thread-safe debugging tools
2. Add synchronization logging
3. Reduce concurrency to isolate issues
4. Use static analysis tools for race detection
5. Stress test with high concurrency
        `
      },
      {
        title: "Memory Issues",
        content: `
**Memory Leaks**:
• Unreferenced objects not garbage collected
• Event listeners not removed
• Circular references
• Growing caches without bounds

**Buffer Overflows**:
• Array bounds checking
• String length validation
• Input sanitization
• Use safe string functions

**Debugging Tools**:
• Valgrind (C/C++)
• Memory profilers
• Garbage collection logs
• Heap dump analysis
        `
      }
    ]
  },
  "mental-models": {
    title: "Mental Models & Thinking Tools",
    icon: Brain,
    sections: [
      {
        title: "The Debugging Mindset",
        content: `
**Curiosity over Frustration**:
• Every bug is a learning opportunity
• Approach with genuine curiosity about why it's happening
• Celebrate finding bugs - they were always there, now you can fix them

**Systematic vs Random**:
• Avoid "shotgun debugging" (changing random things)
• Form hypotheses before making changes
• Change one thing at a time
• Document what you've tried

**Beginner's Mind**:
• Question your assumptions
• Don't assume you know what the code does
• Read the actual code, not what you think it says
• Consider that your understanding might be wrong
        `
      },
      {
        title: "The Stack Trace as a Story",
        content: `
Stack traces tell the story of how your program got into trouble.

**Reading Stack Traces**:
• Start from the bottom (where it all began)
• Work your way up to understand the call chain
• Focus on YOUR code, not library code
• Look for patterns in recursive calls

**Common Stack Trace Patterns**:
• Infinite recursion → Repeating function names
• Null pointer → Accessing methods on null objects
• Array bounds → Index access with invalid index
• Type errors → Wrong data type being used
        `
      },
      {
        title: "Code as Communication",
        content: `
**Self-Documenting Debugging**:
• Write code that expresses intent clearly
• Use meaningful variable and function names
• Break complex expressions into named variables
• Add comments explaining WHY, not WHAT

**Defensive Programming**:
• Validate inputs at function boundaries
• Use assertions for impossible conditions
• Fail fast with meaningful error messages
• Design for debuggability from the start

**Code Review Mindset**:
• How would someone else understand this?
• What assumptions am I making?
• What could go wrong with this approach?
• How can I make this easier to debug later?
        `
      }
    ]
  },
  "tools": {
    title: "Debugging Tools & Workflows",
    icon: Wrench,
    sections: [
      {
        title: "Browser Developer Tools",
        content: `
**Console Debugging**:
• console.log() with descriptive labels
• console.table() for arrays and objects
• console.group() to organize output
• console.time() / console.timeEnd() for performance

**Debugger Features**:
• Step through code line by line
• Inspect variable values in real-time
• Modify variables during execution
• Set conditional and temporary breakpoints

**Network & Performance**:
• Monitor API calls and responses
• Analyze loading times and bottlenecks
• Profile memory usage and garbage collection
• Debug service workers and web workers
        `
      },
      {
        title: "IDE Debugging Features",
        content: `
**Integrated Debuggers**:
• Set breakpoints directly in your editor
• Evaluate expressions in debug console
• View call stack and variable scope
• Debug multiple files simultaneously

**Code Analysis Tools**:
• Static analysis and linting
• Type checking (TypeScript, mypy, etc.)
• Code coverage reports
• Complexity analysis

**Refactoring Support**:
• Safe renaming across the codebase
• Extract functions and variables
• Move code between files
• Automated code formatting
        `
      },
      {
        title: "Command Line Debugging",
        content: `
**Language-Specific Debuggers**:
• gdb (C/C++), pdb (Python), jdb (Java)
• Node.js inspector, Chrome DevTools
• LLDB for iOS/macOS development

**System-Level Tools**:
• strace/dtrace for system calls
• tcpdump/wireshark for network issues
• ps/top/htop for process monitoring
• lsof for file/socket debugging

**Version Control for Debugging**:
• git bisect to find regression bugs
• git blame to understand code history
• git diff to see what changed
• Branches for experimental fixes
        `
      }
    ]
  },
  "workflows": {
    title: "Debugging Workflows & Best Practices", 
    icon: BookOpen,
    sections: [
      {
        title: "The Bug Report Investigation",
        content: `
**Information Gathering**:
1. What exactly happened? (symptoms)
2. What was expected to happen?
3. When did it start happening?
4. How often does it happen?
5. What are the steps to reproduce?
6. What's the environment (OS, browser, version)?

**Reproduction Strategy**:
1. Try to reproduce locally first
2. Create a minimal reproduction case
3. Document exact steps and conditions
4. Test edge cases and variations
5. Confirm fix resolves the original issue
        `
      },
      {
        title: "Performance Debugging Workflow",
        content: `
**Measurement First**:
1. Establish baseline performance metrics
2. Profile before making changes
3. Focus on the biggest bottlenecks first
4. Measure impact of each optimization

**Common Performance Issues**:
• N+1 queries in database operations
• Inefficient algorithms (O(n²) vs O(n log n))
• Memory leaks causing garbage collection pressure
• Blocking I/O operations
• Unnecessary re-rendering in UI frameworks

**Tools & Techniques**:
• Profilers (Chrome DevTools, Python cProfile)
• Database query analysis
• Memory heap analysis
• Network waterfall analysis
        `
      },
      {
        title: "Production Debugging Strategy",
        content: `
**Safety First**:
• Never debug directly in production
• Use feature flags for safe rollouts
• Have rollback plans ready
• Monitor error rates during deployments

**Information Collection**:
• Centralized logging with correlation IDs
• Error tracking with stack traces
• Performance monitoring and alerts
• User session recordings (where appropriate)

**Debugging Without Breaking Things**:
• Use read-only access when possible
• Test fixes in staging environments first
• Implement circuit breakers for failing services
• Use canary deployments for risky changes
        `
      }
    ]
  },
  "reference": {
    title: "Quick Reference & Cheat Sheet",
    icon: Lightbulb,
    sections: [
      {
        title: "Common Error Patterns by Language",
        content: `
**JavaScript**:
• TypeError: Cannot read property 'X' of null/undefined → Null checking needed
• ReferenceError: X is not defined → Variable scope or typo
• SyntaxError: Unexpected token → Missing brackets, commas, or quotes
• RangeError: Maximum call stack exceeded → Infinite recursion

**Python**:
• IndentationError → Mixed tabs/spaces or incorrect nesting
• NameError: name 'X' is not defined → Variable scope or typo
• IndexError: list index out of range → Array bounds checking
• TypeError: 'X' object is not iterable → Wrong data type in loop

**Java**:
• NullPointerException → Null checking needed
• ArrayIndexOutOfBoundsException → Array bounds checking
• ClassCastException → Type casting issues
• ConcurrentModificationException → Modifying collection during iteration

**C/C++**:
• Segmentation fault → Memory access violation
• Buffer overflow → Array bounds or string length issues  
• Memory leak → Missing free() or delete calls
• Dangling pointer → Using freed memory
        `
      },
      {
        title: "Debugging Commands Cheat Sheet",
        content: `
**Browser DevTools**:
• F12 → Open developer tools
• Ctrl+Shift+I → Open inspector
• Ctrl+Shift+C → Element selector
• Ctrl+Shift+J → Console
• F8 → Resume script execution
• F10 → Step over
• F11 → Step into

**GDB (C/C++)**:
• gdb ./program → Start debugging
• break main → Set breakpoint
• run → Start execution
• print variable → Show variable value
• step → Step into
• next → Step over
• continue → Resume execution

**Python PDB**:
• import pdb; pdb.set_trace() → Set breakpoint
• n → Next line
• s → Step into
• c → Continue
• p variable → Print variable
• l → List source code
• q → Quit debugger
        `
      },
      {
        title: "Quick Diagnosis Questions",
        content: `
**When Code Doesn't Run**:
1. Are there syntax errors?
2. Are all dependencies installed?
3. Is the entry point correct?
4. Are file permissions correct?

**When Code Runs But Wrong Output**:
1. Are variable values what you expect?
2. Is the logic flow correct?
3. Are boundary conditions handled?
4. Are data types correct?

**When Code Is Slow**:
1. Are there nested loops?
2. Are you doing redundant work?
3. Is I/O blocking execution?
4. Are data structures appropriate?

**When Code Crashes**:
1. What's the exact error message?
2. What's the call stack?
3. What changed recently?
4. Can you reproduce it consistently?
        `
      }
    ]
  }
}

export default function LearningGuide() {
  const [activeSection, setActiveSection] = useState("methodology")
  const [expandedSubsections, setExpandedSubsections] = useState({})

  const toggleSubsection = (sectionKey, subsectionIndex) => {
    const key = `${sectionKey}-${subsectionIndex}`
    setExpandedSubsections(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const formatContent = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />
      
      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <div key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </div>
        )
      }
      
      // Handle bullet points
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} className="mb-1 ml-4" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-primary)', marginRight: '8px' }}>▶</span>
            {line.trim().substring(1).trim()}
          </div>
        )
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} className="mb-1 ml-4" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-secondary)', marginRight: '8px' }}>
              {line.trim().match(/^\d+/)[0]}.
            </span>
            {line.trim().replace(/^\d+\.\s*/, '')}
          </div>
        )
      }
      
      return <div key={index} className="mb-2">{line}</div>
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="brutal-header">Learn</h1>
        <p className="text-secondary">Master the art and science of debugging with systematic approaches and proven methodologies.</p>
      </div>

      <div className="grid grid-2 gap-6">
        {/* Navigation Sidebar */}
        <div className="brutal-card" style={{ height: 'fit-content' }}>
          <h2 className="brutal-subheader mb-4">LEARNING MODULES</h2>
          
          {Object.entries(debuggingContent).map(([key, section]) => {
            const Icon = section.icon
            return (
              <button
                key={key}
                className={`brutal-button w-full mb-2 ${activeSection === key ? 'primary' : ''}`}
                onClick={() => setActiveSection(key)}
                style={{ justifyContent: 'flex-start' }}
              >
                <Icon size={16} style={{ marginRight: '12px' }} />
                {section.title}
              </button>
            )
          })}

          <div className="brutal-card mt-6" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <h3 className="font-bold mb-2">Pro Tip</h3>
            <p className="text-sm text-secondary">
              The best debuggers aren't born, they're made through practice and systematic thinking.
              Apply these concepts to the debugging challenges in this app!
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="brutal-card">
          {debuggingContent[activeSection] && (
            <>
              <div className="flex items-center gap-3 mb-6">
                {React.createElement(debuggingContent[activeSection].icon, { 
                  size: 32, 
                  color: 'var(--accent-primary)' 
                })}
                <h2 className="brutal-subheader">{debuggingContent[activeSection].title}</h2>
              </div>

              <div className="space-y-4">
                {debuggingContent[activeSection].sections.map((subsection, index) => {
                  const isExpanded = expandedSubsections[`${activeSection}-${index}`]
                  
                  return (
                    <div key={index} className="brutal-card" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <button
                        className="w-full flex items-center justify-between p-0 bg-transparent border-none"
                        onClick={() => toggleSubsection(activeSection, index)}
                        style={{ color: 'inherit', cursor: 'pointer' }}
                      >
                        <h3 className="brutal-subheader on-dark" style={{ 
                          fontSize: '1.1rem', 
                          marginBottom: 0
                        }}>
                          {subsection.title}
                        </h3>
                        {isExpanded ? 
                          <ChevronDown size={20} color="var(--accent-primary)" /> : 
                          <ChevronRight size={20} color="var(--text-muted)" />
                        }
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-4" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px' }}>
                          {formatContent(subsection.content)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Interactive Elements */}
              {activeSection === 'methodology' && (
                <div className="brutal-card mt-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h3 className="brutal-subheader mb-4">PRACTICE EXERCISE</h3>
                  <p className="text-secondary mb-4">
                    Next time you encounter a bug, try following the DEBUG.EXE methodology step by step. 
                    Write down your observations and hypotheses before touching any code.
                  </p>
                  <div className="flex gap-2">
                    <button className="brutal-button primary" onClick={() => window.open('/', '_blank')}>
                      PRACTICE ON CHALLENGES
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'workflows' && (
                <div className="mt-6">
                  <DebugChecklist onComplete={() => {
                    // Could add achievement tracking here
                  }} />
                </div>
              )}

              {activeSection === 'tools' && (
                <div className="brutal-card mt-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h3 className="brutal-subheader mb-4">TOOL CHECKLIST</h3>
                  <div className="grid grid-2 gap-4">
                    <div>
                      <h4 className="font-bold mb-2">Essential Tools:</h4>
                      <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <div>- Browser DevTools</div>
                        <div>- IDE Debugger</div>
                        <div>- Version Control (Git)</div>
                        <div>- Logging Framework</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Advanced Tools:</h4>
                      <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <div>- Static Analysis</div>
                        <div>- Memory Profiler</div>
                        <div>- Network Monitor</div>
                        <div>- Error Tracking</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'reference' && (
                <div className="brutal-card mt-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h3 className="brutal-subheader mb-4">QUICK ACCESS</h3>
                  <p className="text-secondary mb-4">
                    Bookmark this section for quick reference during debugging sessions. 
                    Print out the cheat sheet and keep it near your workspace!
                  </p>
                  <div className="grid grid-3 gap-4">
                    <div className="brutal-card" style={{ backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}>
                      <h4 className="font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>ERROR PATTERNS</h4>
                      <p className="text-xs">Common bugs by language</p>
                    </div>
                    <div className="brutal-card" style={{ backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}>
                      <h4 className="font-bold mb-2" style={{ color: 'var(--accent-secondary)' }}>COMMANDS</h4>
                      <p className="text-xs">Debugger shortcuts</p>
                    </div>
                    <div className="brutal-card" style={{ backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}>
                      <h4 className="font-bold mb-2" style={{ color: '#ffaa00' }}>DIAGNOSIS</h4>
                      <p className="text-xs">Quick questions to ask</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}