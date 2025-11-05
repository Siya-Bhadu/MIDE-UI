
// This is to be used/expanded/changed for when we connect to the drone, might be moved later
class DroneConnection {
  /**
    - Just like CPP we can define methods, attributes as public, private, protected
    - Refer to the types of data allowed in Typescript documentation 
    */  
    public drone_name: string;

    private states: Float32List[];
    private isActive: boolean = false;
  
    constructor(drone_name: string, states: Float32List[] = []) 
    {
      this.drone_name = drone_name;
      this.states = states;
    }

    public updateStates(newStates: Float32List[]): void
    {
      this.states = newStates;
    }
    
  }

class Dog{
    public name: string;
    public age: number;
    private breed: string;

    constructor(name:string,
        age:number,
        breed:string
    ){
        this.name = name;
        this.age = age;
        this.breed = breed;
    }

    public regularBark(dog:Dog) {
        console.log(`${this.name} saw: ${dog.name}`);

    }

    // Arrow functions are typically better when handling React handlers, callbacks
    // Since we keep track of the states and instances of all our attributes
    public arrowBark = (dog:Dog) => {
        console.log(`${this.name} saw: ${dog.name}`);
    }

    // // example of basic function
    // multiplyNumber = (a:float, b:float) => {return a*b};
}

const appa = new Dog("Appa", 12, "shiba");
const wally = new Dog("Wally", 10, "corgi");

appa.regularBark(wally);
appa.arrowBark(wally);