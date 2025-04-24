export interface JSONError {
  message: string;
  line: number;
  column: number;
  position: number;
}

export const findErrorPosition = (
  jsonString: string,
  position: number
): { line: number; column: number } => {
  const lines = jsonString.split('\n');
  let line = 1;
  let column = 1;
  let currentPosition = 0;

  for (const lineText of lines) {
    if (currentPosition + lineText.length >= position) {
      column = position - currentPosition + 1;
      break;
    }
    currentPosition += lineText.length + 1; // +1 for the newline character
    line++;
  }

  return { line, column };
};

export const validateJSON = (jsonString: string): JSONError | null => {
  try {
    JSON.parse(jsonString);
    return null;
  } catch (err) {
    if (err instanceof SyntaxError) {
      const match = err.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const { line, column } = findErrorPosition(jsonString, position);
        return {
          message: err.message,
          line,
          column,
          position,
        };
      }
    }
    return {
      message: 'Invalid JSON format',
      line: 1,
      column: 1,
      position: 0,
    };
  }
};
