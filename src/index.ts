interface Person {
    name: string, 
    age: number
}

function greet(person: Person) : string {
    return `Hello my name is ${person.name} and I am ${person.age} years old`;
}

const john: Person = {name: 'John', age: 30};
console.log(greet(john));