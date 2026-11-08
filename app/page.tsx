'use client'
import React from 'react'
import { Clerk, Model } from './model'

export default function Page() {
  const [model, setModel] = React.useState(new Model())
  const [redraw, setRedraw] = React.useState(0)

 // CONTROLLER object (there are three...)
 const populateModel = () => {
    setRedraw(redraw+1)
 }

 const addClerk = () => {
   const clerkNameInput = (document.querySelectorAll('input')[0] as HTMLInputElement)
   model.addClerk(clerkNameInput.value)
   clerkNameInput.value = ''
   populateModel()
 }

 const removeClerk = (clerk: Clerk) => {
   model.removeClerk(clerk)
   populateModel()
 }

 const addVisitor = () => {
   const visitorNameInput = (document.querySelectorAll('input')[1] as HTMLInputElement)
   const visitorReasonInput = (document.querySelectorAll('input')[2] as HTMLInputElement)
   model.addVisitor(visitorNameInput.value, visitorReasonInput.value)
   visitorNameInput.value = ''
   visitorReasonInput.value = ''
   populateModel()
 }

 const assignVisitor = (clerk: Clerk, visitorNumber: number) => {
  const visitor = model.visitors.find(visitor => visitor.number === visitorNumber)
  if (visitor) {
    model.assignVisitor(visitor, clerk)
    populateModel()
  }
 }

 const clearClerk = (clerk: Clerk) => {
  model.clearClerk(clerk)
  populateModel()
 }

 // BOUNDARY object

  // Define styles for components

  const containerStyle = {
    display: 'flex',
    gap: '20px',
    width: '100%',
    gridTemplateColumns: '1fr 1fr',
    padding: '10px'
  };

  const mainColumnStyle = {
    flex: 1,
    padding: '20px'
  };

  const clerkRowStyle = {
    display: 'grid',
    gridTemplateColumns: '15% 15% 25% 35%',
    width: '100%',
    padding: '10px'
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  };

  const visitorRowStyle = {
    display: 'grid',
    gridTemplateColumns: '7% 20% 15% 58%',
    width: '100%',
    padding: '10px'
  };

  const buttonStyle = {
    padding: '5px 2%',
    borderRadius: '4px',
    border: '1px solid',
    cursor: 'pointer',
    marginRight: '5px',
    marginBottom: '5px'
  };

  const shortInputStyle = {
    padding: '5px 10px',
    borderRadius: '4px',
    border: '1px solid',
    width: '25%',
    marginRight: '10px'
  };

  const longInputStyle = {
    padding: '5px 10px',
    borderRadius: '4px',
    border: '1px solid',
    width: '45%',
    marginRight: '10px'
  };

  const dropdownStyle = {
    padding: '5px 10px',
    borderRadius: '4px',
    border: '1px solid',
    marginRight: '10px'
  };

 return (
  <div>
    <div style={containerStyle}>
      <div style={mainColumnStyle}>
        <h1>Clerks</h1>
        <input type="text" placeholder="Enter clerk name" style={shortInputStyle} />
        <button style={buttonStyle} onClick={() => {
          addClerk()
        }}>Add Clerk</button>
        <div style={clerkRowStyle}>
          <div><b>Name</b></div>
          <div><b># helped</b></div>
          <div><b>Assigned Visitor</b></div>
          <div><b>Actions</b></div>
        </div>
        {model.clerks.map((clerk, index) => (
          <div style={clerkRowStyle} key={index}>
            <div>{clerk.name}</div>
            <div>{clerk.helped}</div>
            {(() => {
              if (clerk.assigned()) {
                return <>
                  <div>
                    <b>{clerk.visitor[0].number}</b> - {clerk.visitor[0].name}
                  </div>
                  <div style={actionsStyle}>
                    <button style={buttonStyle} onClick={() => {
                      clearClerk(clerk)
                    }}>Clear Visitor</button>
                  </div>
                </>
              }
              // Dropdown of unassigned visitors
              const formId = `assign-visitor-${index}`
              return <>
                <form id={formId} onSubmit={event => {
                  event.preventDefault()
                  const selectedVisitor = new FormData(event.currentTarget).get('visitor')
                  assignVisitor(clerk, Number(selectedVisitor))
                }}>
                  <select name="visitor" defaultValue="" style={dropdownStyle}>
                    <option value="" disabled hidden>Choose a visitor...</option>
                    {model.visitors.filter(visitor => !visitor.assigned).map(visitor => (
                      <option key={visitor.number} value={visitor.number}>{visitor.number} - {visitor.name}</option>
                    ))}
                  </select>
                </form>
                <div style={actionsStyle}>
                  <button type="submit" form={formId} style={buttonStyle}>Assign Visitor</button>
                  <button style={buttonStyle} onClick={() => {
                    removeClerk(clerk)
                  }}>Remove Clerk</button>
                </div>
              </>})()}
            </div>
          ))}
      </div>
      <div style={mainColumnStyle}>
        <h1>Queue</h1>
        <input type="text" placeholder="Enter visitor name" style={shortInputStyle} />
        <input type="text" placeholder="Enter reason for visit" style={{fontStyle: 'italic', ...longInputStyle}} />
        <button style={buttonStyle} onClick={() => {
          addVisitor()
        }}>Add Visitor</button>
          <div style={visitorRowStyle}>
            <div><b>#</b></div>
            <div><b>Name</b></div>
            <div><b>Arrival</b></div>
            <div><b>Reason</b></div>
          </div>
          {model.visitors.filter(visitor => !visitor.assigned).map((visitor, index) => (
              <div style={visitorRowStyle} key={index}>
                <div><b>{visitor.number}</b></div>
                <div>{visitor.name}</div>
                <div>{visitor.arrival.toLocaleTimeString()}</div>
                <div><i>{visitor.reason}</i></div>
              </div>
          ))}
      </div>
    </div>
    <div style={mainColumnStyle}>
      <p><b># of Clerks</b>: {model.clerks.length}</p>
      <p><b># of Visitors</b>: {model.visitors.length}</p>
      <p><b># Waiting</b>: {model.visitors.filter(visitor => !visitor.assigned).length}</p>
      <p><b>Total Helped</b>: {model.clerks.reduce((sum, clerk) => sum + clerk.helped, 0)}</p>
    </div>
  </div>
 )
}