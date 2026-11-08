// ENTITY object
export class Model {
  visitors: Visitor[]
  clerks: Clerk[]

  constructor() {
    this.visitors = []
    this.clerks = []
  }

  addVisitor(name: string, reason: string): boolean {
    this.visitors.push(new Visitor(name, this.visitors.length + 1, reason, new Date()))
    return true
  }

  removeVisitor(visitor: Visitor): boolean {
    const index = this.visitors.indexOf(visitor)
    if (index === -1) {
      return false
    }
    this.visitors.splice(index, 1)
    return true
  }

  addClerk(name: string): boolean {
    if (this.clerks.find(clerk => clerk.name === name)) {
      return false
    }
    this.clerks.push(new Clerk(name))
    return true
  }

  removeClerk(clerk: Clerk): boolean {
    const index = this.clerks.indexOf(clerk)
    if (index === -1 || clerk.assigned() || this.clerks.length === 0) {
      return false
    }
    this.clerks.splice(index, 1)
    return true
  }

  assignVisitor(visitor: Visitor, clerk: Clerk): boolean {
    return clerk.assign(visitor)
  }

  clearClerk(clerk: Clerk): boolean {
    const visitor = clerk.visitor[0]
    const result = clerk.clear()
    if (result) {
      this.removeVisitor(visitor)
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
