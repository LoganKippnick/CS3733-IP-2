// ENTITY object
export class Model {
  visitors: Visitor[]
  clerks: Clerk[]

  constructor() {
    this.visitors = []
    this.clerks = []
  }

  addVisitor(name: string, number: number, reason: string): boolean {
    this.visitors.push(new Visitor(name, number, reason))
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
    if (index > -1) {
      this.clerks.splice(index, 1)
      return true
    }
    return false
  }

  assignVisitor(visitor: Visitor, clerk: Clerk): boolean {
    return clerk.assign(visitor)
  }

  clearClerk(clerk: Clerk): boolean {
    return clerk.clear()
  }
}

export class Visitor {
  name: string
  number: number
  reason: string

  constructor(name: string, number: number, reason: string) {
    this.name = name
    this.number = number
    this.reason = reason
  }
}

export class Clerk {
  name: string
  visitor: Visitor[]

  constructor(name: string) {
    this.name = name
    this.visitor = []
  }

  assign(visitor: Visitor): boolean {
    if (this.visitor.length == 0) {
      this.visitor.push(visitor)
      return true
    }
    else {
      return false
    }
  }

  clear(): boolean {
    this.visitor = []
    return true
  }
}
