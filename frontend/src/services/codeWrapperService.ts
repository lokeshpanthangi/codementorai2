/**
 * Code Wrapper Service
 * 
 * This service combines user-written function code with wrapper code that handles I/O.
 * Similar to LeetCode, users only write the logic inside a function, and the wrapper
 * handles reading input and printing output.
 */

export interface WrapperConfig {
  userCode: string;
  wrapperTemplate?: string;
  functionName?: string;
  functionSignature?: string;
  inputParsing?: string;
  outputFormatting?: string;
}

/**
 * Remove import statements that reference modules not present in the submission.
 * Dynamically detects patterns like:
 *   - from <module> import <Class/function>
 *   - import <module>
 * Only removes lines present in the original wrapper template, ensuring we don't
 * strip standard library imports added by the user.
 */
const cleanupOrphanedImports = (wrappedCode: string, originalTemplate: string): string => {
  // Extract all import lines from the original wrapper template
  const templateImportLines = originalTemplate.match(/^(?:from\s+\S+\s+import\s+.+|import\s+\S+)$/gm) || [];
  
  let cleanedCode = wrappedCode;
  
  for (const importLine of templateImportLines) {
    // Parse the module name from the import statement
    const fromMatch = importLine.match(/^from\s+(\S+)\s+import/);
    const importMatch = importLine.match(/^import\s+(\S+)/);
    
    const moduleName = fromMatch?.[1] || importMatch?.[1];
    
    if (!moduleName) continue;
    
    // Skip standard library modules (common ones for Python, Java, C++)
    const stdLibModules = new Set([
      // Python
      'sys', 'os', 'math', 'random', 'datetime', 'json', 'collections', 
      're', 'itertools', 'functools', 'typing', 'copy', 'heapq',
      // Java (java.* packages are handled by the JVM)
      'java', 'javax',
      // C++ (std:: is handled by compiler)
      'std', 'iostream', 'string', 'vector', 'algorithm', 'map', 'set'
    ]);
    
    // Check if the module starts with a known standard library prefix
    const isStdLib = stdLibModules.has(moduleName) || 
                     moduleName.startsWith('java.') || 
                     moduleName.startsWith('javax.');
    
    if (isStdLib) continue;
    
    // Remove this import line (handles both LF and CRLF)
    const escapedImport = importLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cleanedCode = cleanedCode.replace(new RegExp(`^${escapedImport}\\s*(\\r?\\n)?`, 'gm'), '');
  }
  
  return cleanedCode;
};

/**
 * Wrap user code with the appropriate template for execution
 */
export const wrapUserCode = (config: WrapperConfig, language: string): string => {
  const { 
    userCode, 
    wrapperTemplate, 
    functionName = 'solution',
    functionSignature = '',
    inputParsing = `lines = input_data.split('\\n')
args = tuple(json.loads(line) if line.strip() else '' for line in lines)`,
    outputFormatting = 'formatted_result = json.dumps(result) if isinstance(result, (list, dict)) else str(result)'
  } = config;
  
  // Use provided wrapper template or default
  const template = wrapperTemplate || DEFAULT_WRAPPERS[language] || DEFAULT_WRAPPERS.python;
  
  // Replace placeholders in the template
  let wrappedCode = template
    .replace(/\{\{USER_CODE\}\}/g, userCode)
    .replace(/\{\{INPUT_PARSING\}\}/g, inputParsing)
    .replace(/\{\{OUTPUT_FORMATTING\}\}/g, outputFormatting);
  
  // Handle function call replacement based on language and signature
  const functionCall = generateFunctionCall(functionName, functionSignature, language);
  wrappedCode = wrappedCode.replace(/\{\{FUNCTION_CALL\}\}/g, functionCall);
  
  // Clean up any orphaned imports
  return cleanupOrphanedImports(wrappedCode, template);
};

/**
 * Generate the appropriate function call based on language and signature
 */
const generateFunctionCall = (functionName: string, signature: string, language: string): string => {
  if (!signature) {
    // Fallback to simple function call
    return language === 'python' ? `solution.${functionName}(args)` : 
           language === 'java' ? `sol.${functionName}(args)` :
           `sol.${functionName}(args)`;
  }
  
  // Parse signature to determine parameters
  // This is a simplified version - in production, you'd want more robust parsing
  if (language === 'python') {
    return `solution.${functionName}(*args)`;
  } else if (language === 'java') {
    return `sol.${functionName}(parsedArgs)`;
  } else if (language === 'cpp') {
    return `sol.${functionName}(parsedArgs)`;
  }
  
  return `${functionName}(args)`;
};

/**
 * Default wrapper templates for different languages (LeetCode-style)
 * These are fallbacks if the problem doesn't provide custom wrappers
 */
export const DEFAULT_WRAPPERS: Record<string, string> = {
  python: `import sys
import json
from typing import List, Optional, Dict, Any

{{USER_CODE}}

if __name__ == "__main__":
    input_data = sys.stdin.read().strip()
    
    # Parse input based on problem's input parsing logic
    try:
        {{INPUT_PARSING}}
    except:
        # Fallback: try JSON parsing each line
        lines = input_data.split('\\n')
        args = tuple(json.loads(line) for line in lines)
    
    # Create solution instance and call the function
    solution = Solution()
    result = {{FUNCTION_CALL}}
    
    # Format output based on problem's output formatting logic
    {{OUTPUT_FORMATTING}}
    
    print(formatted_result)
`,

  java: `import java.util.*;
import java.io.*;

{{USER_CODE}}

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String input = br.readLine();
        
        // Parse input based on problem's input parsing logic
        {{INPUT_PARSING}}
        
        // Create solution instance and call the function
        Solution sol = new Solution();
        Object result = {{FUNCTION_CALL}};
        
        // Format output based on problem's output formatting logic
        {{OUTPUT_FORMATTING}}
        
        System.out.println(formattedResult);
        br.close();
    }
}
`,

  cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

{{USER_CODE}}

int main() {
    string input;
    getline(cin, input);
    
    // Parse input based on problem's input parsing logic
    {{INPUT_PARSING}}
    
    // Create solution instance and call the function
    Solution sol;
    auto result = {{FUNCTION_CALL}};
    
    // Format output based on problem's output formatting logic
    {{OUTPUT_FORMATTING}}
    
    cout << formattedResult << endl;
    return 0;
}
`,
};

/**
 * Check if a wrapper template is needed based on the code structure
 */
export const needsWrapper = (code: string, language: string): boolean => {
  // Python: Check if it has if __name__ == "__main__"
  if (language === 'python') {
    return !code.includes('if __name__') && !code.includes('input()');
  }
  
  // Java: Check if it has main method
  if (language === 'java') {
    return !code.includes('public static void main');
  }
  
  // C++: Check if it has main function
  if (language === 'cpp') {
    return !code.includes('int main()');
  }
  
  return false;
};

/**
 * Extract just the user's function code (remove any existing wrapper)
 */
export const extractUserCode = (fullCode: string, language: string): string => {
  // For now, return as-is. In the future, we can implement smart extraction
  // based on the language and wrapper patterns
  return fullCode;
};
