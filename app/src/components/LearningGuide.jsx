import React, { useState } from 'react'
import { Lightbulb, Target, Search, Wrench, Brain, BookOpen } from 'lucide-react'
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

  const formatContent = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <div key={index} style={{ height: '8px' }} />

      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <div key={index} style={{ marginBottom: '12px', fontSize: '13px', lineHeight: '1.6' }}>
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part}</strong> : <span style={{ color: 'var(--text-secondary)' }}>{part}</span>
            )}
          </div>
        )
      }

      // Handle bullet points
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} style={{
            marginBottom: '8px',
            marginLeft: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start'
          }}>
            <span style={{ color: 'var(--accent-green)', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>■</span>
            <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{line.trim().substring(1).trim()}</span>
          </div>
        )
      }

      // Handle numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} style={{
            marginBottom: '8px',
            marginLeft: '20px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start'
          }}>
            <span style={{
              color: 'var(--accent-green)',
              fontWeight: 700,
              flexShrink: 0,
              minWidth: '20px'
            }}>
              {line.trim().match(/^\d+/)[0]}.
            </span>
            <span style={{ color: 'var(--text-secondary)', flex: 1 }}>
              {line.trim().replace(/^\d+\.\s*/, '')}
            </span>
          </div>
        )
      }

      return <div key={index} style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>{line}</div>
    })
  }

  return (
    <div className="learning-guide-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 className="brutal-header" style={{ marginBottom: '8px' }}>DEBUGGING GUIDE</h1>
        <p className="text-secondary" style={{ fontSize: '13px' }}>Master debugging with systematic approaches and proven methodologies</p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        borderBottom: '2px solid var(--border-primary)',
        paddingBottom: '8px'
      }}>
        {Object.entries(debuggingContent).map(([key, section]) => {
          const Icon = section.icon
          const isActive = activeSection === key
          return (
            <button
              key={key}
              className={`brutal-button ${isActive ? 'primary' : ''}`}
              onClick={() => setActiveSection(key)}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Icon size={14} />
              <span style={{ textTransform: 'uppercase' }}>{section.title.replace(/^(The |Quick |Advanced |Common |Mental |Debugging )/, '')}</span>
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div>
        {debuggingContent[activeSection] && (
          <>
            {/* Section Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              padding: '16px',
              border: '2px solid var(--border-primary)',
              background: 'var(--bg-secondary)'
            }}>
              {React.createElement(debuggingContent[activeSection].icon, {
                size: 28,
                color: 'var(--text-primary)'
              })}
              <div>
                <h2 className="brutal-subheader" style={{ margin: 0, fontSize: '1.3rem' }}>
                  {debuggingContent[activeSection].title}
                </h2>
              </div>
            </div>

            {/* Sections Grid */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {debuggingContent[activeSection].sections.map((subsection, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-primary)',
                    transition: 'all 0.2s ease'
                  }}
                  className="learning-card"
                >
                  {/* Card Header */}
                  <div style={{
                    padding: '16px 20px',
                    background: 'var(--bg-secondary)',
                    borderBottom: '2px solid var(--border-primary)'
                  }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--text-primary)'
                    }}>
                      {subsection.title}
                    </h3>
                  </div>

                  {/* Card Content */}
                  <div style={{
                    padding: '20px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '13px',
                    lineHeight: '1.8',
                    color: 'var(--text-secondary)'
                  }}>
                    {formatContent(subsection.content)}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Tips/Interactive */}
            <div style={{ marginTop: '24px' }}>
              {activeSection === 'methodology' && (
                <div style={{
                  border: '1px solid var(--accent-green)',
                  background: 'rgba(0, 255, 0, 0.05)',
                  padding: '16px'
                }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>💡 Practice Exercise</h3>
                  <p style={{ fontSize: '12px', lineHeight: '1.5', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                    Try following the DEBUG.EXE methodology step by step on your next bug.
                  </p>
                  <button className="brutal-button primary" onClick={() => window.location.href = '/'} style={{ fontSize: '11px', padding: '6px 12px' }}>
                    START CHALLENGES
                  </button>
                </div>
              )}

              {activeSection === 'workflows' && (
                <div style={{ marginTop: '16px' }}>
                  <DebugChecklist onComplete={() => {}} />
                </div>
              )}

              {activeSection === 'tools' && (
                <div style={{
                  border: '1px solid var(--border-primary)',
                  background: 'var(--bg-secondary)',
                  padding: '16px'
                }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>🛠️ Tool Checklist</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Essential:</h4>
                      <div style={{ fontSize: '11px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <div>→ Browser DevTools</div>
                        <div>→ IDE Debugger</div>
                        <div>→ Version Control</div>
                        <div>→ Logging Framework</div>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Advanced:</h4>
                      <div style={{ fontSize: '11px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        <div>→ Static Analysis</div>
                        <div>→ Memory Profiler</div>
                        <div>→ Network Monitor</div>
                        <div>→ Error Tracking</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'reference' && (
                <div style={{
                  border: '1px solid var(--border-primary)',
                  background: 'var(--bg-secondary)',
                  padding: '16px'
                }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>📌 Quick Access</h3>
                  <p style={{ fontSize: '11px', lineHeight: '1.5', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                    Bookmark this for quick reference during debugging sessions!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}