// ENTITY object
export class Model {
  visitors: Visitor[]
  clerks: Clerk[]
  numVisitors: number
  numClerks: number
  totalHelped: number

  constructor() {
    this.visitors = []
    this.clerks = []
    this.numVisitors = 0
    this.numClerks = 0
    this.totalHelped = 0
  }

  addVisitor(name: string, reason: string): boolean {
    this.visitors.push(new Visitor(name, this.visitors.length + 1, reason, new Date()))
    this.numVisitors++
    return true
  }

  addClerk(name: string): boolean {
    if (this.clerks.find(clerk => clerk.name === name)) {
      return false
    }
    this.clerks.push(new Clerk(name))
    this.numClerks++
    return true
  }

  removeClerk(clerk: Clerk): boolean {
    const index = this.clerks.indexOf(clerk)
    if (index === -1 || clerk.assigned() || this.numClerks <= 0) {
      return false
    }
    this.clerks.splice(index, 1)
    this.numClerks--
    return true
  }

  assignVisitor(visitor: Visitor, clerk: Clerk): boolean {
    return clerk.assign(visitor)
  }

  clearClerk(clerk: Clerk): boolean {
    const result = clerk.clear()
    if (result) {
      this.totalHelped++
      this.numVisitors--
    }
    return result
  }
}

export class Visitor {
  name: string
  number: number
  reason: string
  arrival: Date
  assigned: boolean

  constructor(name: string, number: number, reason: string, arrival: Date) {
    this.name = name
    this.number = number
    this.reason = reason
    this.arrival = arrival
    this.assigned = false
  }

  assign() {
    this.assigned = true
  }
}

export class Clerk {
  name: string
  visitor: Visitor[]
  helped: number

  constructor(name: string) {
    this.name = name
    this.visitor = []
    this.helped = 0
  }

  assigned(): boolean {
    return this.visitor.length > 0
  }

  assign(visitor: Visitor): boolean {
    if (this.assigned()) {
      return false
    }
    this.visitor.push(visitor)
    visitor.assign()
    return true
  }

  clear(): boolean {
    if (!this.assigned()) {
      return false
    }
    this.visitor = []
    this.helped++
    return true
  }
}
