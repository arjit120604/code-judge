// Type mappings for different languages
export const cppToPythonType: Record<string, string> = {
  'int': 'int',
  'float': 'float',
  'double': 'float',
  'string': 'str',
  'bool': 'bool',
  'void': 'None',
  'vector<int>': 'List[int]',
  'vector<string>': 'List[str]',
  'vector<double>': 'List[float]',
  'vector<bool>': 'List[bool]',
  'pair<int,int>': 'Tuple[int, int]',
  'vector<vector<int>>': 'List[List[int]]',
  'vector<vector<string>>': 'List[List[str]]',
  'vector<vector<double>>': 'List[List[float]]',
  'vector<pair<int,int>>': 'List[Tuple[int, int]]'
};

export const cppToJavaScriptType: Record<string, string> = {
  'int': 'number',
  'float': 'number',
  'double': 'number',
  'string': 'string',
  'bool': 'boolean',
  'void': 'void',
  'vector<int>': 'number[]',
  'vector<string>': 'string[]',
  'vector<double>': 'number[]',
  'vector<bool>': 'boolean[]',
  'pair<int,int>': '[number, number]',
  'vector<vector<int>>': 'number[][]',
  'vector<vector<string>>': 'string[][]',
  'vector<vector<double>>': 'number[][]',
  'vector<pair<int,int>>': '[number, number][]'
};

export const cppToJavaType: Record<string, string> = {
  'int': 'int',
  'float': 'float',
  'double': 'double',
  'string': 'String',
  'bool': 'boolean',
  'void': 'void',
  'vector<int>': 'List<Integer>',
  'vector<string>': 'List<String>',
  'vector<double>': 'List<Double>',
  'vector<bool>': 'List<Boolean>',
  'pair<int,int>': 'Pair<Integer, Integer>',
  'vector<vector<int>>': 'List<List<Integer>>',
  'vector<vector<string>>': 'List<List<String>>',
  'vector<vector<double>>': 'List<List<Double>>',
  'vector<pair<int,int>>': 'List<Pair<Integer, Integer>>'
}; 