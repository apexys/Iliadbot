var fs = require('fs');

console.log("Reading verses.txt");

var lines = fs.readFileSync('verses.txt', 'utf-8');
lines = lines.split('\n');

console.log("Generating markov table");

var markov_table = {};
var last_word = "";

lines.forEach(function(line, index){
   line = line.replace(/[\W_]+/g," ");
   line = line.replace(/\s+/g, " ");
   var words = line.split(" ");
   words.forEach(function(word, i){
      if(word.length > 0){
         //If not already in table, add word
         if(!markov_table[word]){
            markov_table[word] = {};
         }
         //If last word not set, set to current word
         if(last_word == ""){
            last_word = word;
         }else{//We got a word before that
            if(!markov_table[last_word][word]){//Last word doesn't have any links yet
               markov_table[last_word][word] = 1; //There's been one occurence that *word* followed *last_word*
               markov_table[last_word].link_sum = 1;
            }else{
               markov_table[last_word][word] ++; //Increase the likelihood that *word* will follow after *last_word*
               markov_table[last_word].link_sum ++;
            }
         }
      }
   });
});

console.log("writing markov table");

fs.writeFileSync("iliadmarkov.json", JSON.stringify(markov_table), 'utf-8');

console.log("generating random walk of 10");

function pick_random_word_from_table(table){
   var words = [];
   for(var word in table){
      if(table.hasOwnProperty(word)){
            words.push(word);
      }
   }
   return words[Math.floor(Math.random() * words.length)];
}

function pick_next_word_from_word_and_table(word, table){
   var sum = table[word];
   var value = Math.random() * sum;
   for(var next_word in table[word]){
      if(table.hasOwnProperty(next_word)){
         value -= table[word][next_word];
      }
      if(value <= 0){
         return next_word;
      }
   }
   return pick_random_word_from_table(table);
}

function random_markov_walk(num_words, table){
   var last = pick_random_word_from_table(table);
   var result = last;
   for(var i = 1; i < num_words; i++){
      last = pick_next_word_from_word_and_table(last, table);
      result = [result, last].join(" ");
   }
   return result;
}

console.log(random_markov_walk(10, markov_table));

console.log("done");
