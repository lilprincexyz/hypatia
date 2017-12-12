const mongoose = require('mongoose');

// a schema to represent a religion
const religionSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String},
  synonyms: [String],
  currentLeader: {type: String},
  membership: {type: String},
  historicalRoots: {type: String, required: true},
  basicBeliefs: {type: String, required: true},
  practices: {type: String, required: true},
  organization: {type: String, required: true},
  leadership: {type: String},
  worship: {type: String},
  diet: {type: String},
  funerary: {type: String},
  medical: {type: String},
  other: {type: String},
  books: {type: [String], required: true},
  moreInfo: {type: String},
  created: {type: Date, default: Date.now}
});

// a method used to return an object that
// exposes all of the fields from the underlying data
religionSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    address: this.address,
    synonyms: this.synonyms,
    currentLeader: this.currentLeader,
    membership: this.membership,
    historicalRoots: this.historicalRoots,
    basicBeliefs: this.basicBeliefs,
    practices: this.practices,
    organization: this.organization,
    leadership: this.leadership,
    worship: this.worship,
    diet: this.diet,
    funerary: this.funerary,
    medical: this.medical,
    other: this.other,
    books: this.books,
    moreInfo: this.moreInfo,
    created: this.created
  };
}

// a call made to `.model`.
const Religion = mongoose.model('religion', religionSchema);

module.exports = {Religion};
