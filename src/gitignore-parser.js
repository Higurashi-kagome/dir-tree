/* NOTE: The code of this file comes from https://github.com/codemix/gitignore-parser */

/**
 * Compile the given `.gitignore` content (not filename!)
 * and return an object with `accepts`, `denies` and `maybe` methods.
 * These methods each accepts a single filename and determines whether
 * they are acceptable or unacceptable according to the `.gitignore` definition.
 *
 *
 * @param  {String} content The `.gitignore` content to compile.
 * @return {Object}         The helper object with methods that operate on the compiled content.
 */
exports.compile = function (content) {
  var parsed = exports.parse(content),
      positive = parsed[0],
      negative = parsed[1];
  return {
    accepts: function (input) {
      if (input[0] === '/') input = input.slice(1);
      return negative.test(input) || !positive.test(input);
    },
    denies: function (input) {
      if (input[0] === '/') input = input.slice(1);
      return !(negative.test(input) || !positive.test(input));
    }
  };
};

/**
 * Parse the given `.gitignore` content and return an array
 * containing two further arrays - positives and negatives.
 * Each of these two arrays in turn contains two regexps, one
 * strict and one for 'maybe'.
 *
 * @param  {String} content  The content to parse,
 * @return {Array[]}         The parsed positive and negatives definitions.
 */
exports.parse = function (content) {
  return content.split('\n').map(function (line) {// Split as lines
    return line.trim();
  }).filter(function (line) {// Filter empty and comment
    return line && line[0] !== '#';
  }).reduce(function (lists, line) {// Divided into Negative and Positive
      let isNegative = line[0] === '!';
      if (isNegative) line = line.slice(1);
      if (line[0] === '/') line = line.slice(1);
      if (isNegative) lists[1].push(line);
      else lists[0].push(line);
      return lists;
  }, [[], []]).map(function (list) {// Convert gitignore pattern into regexp
    return list.sort().map(prepareRegexPattern);
  }).map(function (list) {// Concat regexps
    return list.length > 0 ? new RegExp('^((' + list.join(')|(') + '))') : new RegExp('$^');
  });
};

function prepareRegexPattern (ignorePattern) {
  let escaped = ignorePattern.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&");
  return escaped.replace('**', '(.+)').replace('*', '([^\\/]+)');
}


