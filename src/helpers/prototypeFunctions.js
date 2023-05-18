String.prototype.splitKeep = function (splitter, ahead) {
  var self = this;
  var result = [];
  if (splitter !== '') {
    // Substitution of matched string
    function getSubst(value) {
      var substChar = value[0] === '0' ? '1' : '0';
      var subst = '';
      for (var i = 0; i < value.length; i++) {
        subst += substChar;
      }
      return subst;
    };
    var matches = [];
    // Getting mached value and its index
    var replaceName = splitter instanceof RegExp ? "replace" : "replaceAll";
    var r = self[replaceName](splitter, function (m, i, e) {
      matches.push({
        value: m,
        index: i
      });
      return getSubst(m);
    });
    // Finds split substrings
    var lastIndex = 0;
    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      var nextIndex = ahead === true ? m.index : m.index + m.value.length;
      if (nextIndex !== lastIndex) {
        var part = self.substring(lastIndex, nextIndex);
        result.push(part);
        lastIndex = nextIndex;
      }
    };
    if (lastIndex < self.length) {
      var part2 = self.substring(lastIndex, self.length);
      result.push(part2);
    };
  } else {
    result.add(self);
  };
  return result;
};