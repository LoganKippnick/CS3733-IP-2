'use client'
import React from 'react'
import { Model } from './model'

export default function Home() {
  const [model, setModel] = React.useState(new Model())
  const [redraw, setRedraw] = React.useState(0)

 // CONTROLLER object (there are three...)
 const populateModel = () => {
    setRedraw(redraw+1)
 }

 const addClerk = () => {
   const clerkNameInput = (document.querySelector('input') as HTMLInputElement)
   model.addClerk(clerkNameInput.value)
   clerkNameInput.value = ''
   populateModel()
 }

 // BOUNDARY object
 return (
 <main className="flex min-h-screen flex-col items-center justify-between p-24">
   <div>
      <h1>Clerks</h1>
      <input type="text" placeholder="Enter clerk name" />
      <button onClick={() => {
        addClerk()
      }}>Add Clerk</button>
      <ul>
        {model.clerks.map((clerk, index) => (
          <li key={index}>{clerk.name}</li>
        ))}
      </ul>
   </div>
 </main>
 )
}