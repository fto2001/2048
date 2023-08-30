"use strict";
function greet(person) {
    return `Hello my name is ${person.name} and I am ${person.age} years old`;
}
const john = { name: 'John', age: 30 };
console.log(greet(john));
