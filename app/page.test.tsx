import {afterEach, describe, expect, it} from 'vitest'
import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import Page from './page'

afterEach(cleanup)

describe('Main page', () => {
    it('lets a user add a clerk', () => {
        render(<Page />)

        fireEvent.change(screen.getByPlaceholderText('Enter clerk name'), { target: { value: 'Alice' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Clerk' }))
        expect(screen.getByText('Alice')).toBeTruthy()
    })

    it('lets a user remove a clerk', () => {
        render(<Page />)

        fireEvent.change(screen.getByPlaceholderText('Enter clerk name'), { target: { value: 'Alice' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Clerk' }))
        fireEvent.click(screen.getByRole('button', { name: 'Remove Clerk' }))
        expect(screen.queryByText('Alice')).toBeNull()
    })

    it('lets a user add a visitor', () => {
        render(<Page />)

        fireEvent.change(screen.getByPlaceholderText('Enter visitor name'), { target: { value: 'Bob' } })
        fireEvent.change(screen.getByPlaceholderText('Enter reason for visit'), { target: { value: 'New license plate' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Visitor' }))
        expect(screen.getByText('Bob')).toBeTruthy()
    })

    it('lets a user assign a visitor to a clerk', () => {
        render(<Page />)

        // Add clerk
        fireEvent.change(screen.getByPlaceholderText('Enter clerk name'), { target: { value: 'Alice' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Clerk' }))

        // Add visitor
        fireEvent.change(screen.getByPlaceholderText('Enter visitor name'), { target: { value: 'Bob' } })
        fireEvent.change(screen.getByPlaceholderText('Enter reason for visit'), { target: { value: 'New license plate' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Visitor' }))

        // Assign visitor to clerk
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } })
        fireEvent.click(screen.getByRole('button', { name: 'Assign Visitor' }))

        expect(screen.getByText('1', { selector: 'b' }).parentElement?.textContent).toBe('1 - Bob')
        expect(document.body.textContent.match("Bob")).toHaveLength(1)
        expect(screen.queryByText('New license plate')).toBeNull()
    })

    it('lets a user clear a clerk with an assigned visitor, which helped count', () => {
        render(<Page />)

        // Add clerk
        fireEvent.change(screen.getByPlaceholderText('Enter clerk name'), { target: { value: 'Alice' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Clerk' }))

        // Add visitor
        fireEvent.change(screen.getByPlaceholderText('Enter visitor name'), { target: { value: 'Bob' } })
        fireEvent.change(screen.getByPlaceholderText('Enter reason for visit'), { target: { value: 'New license plate' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Visitor' }))

        // Assign visitor to clerk
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } })
        fireEvent.click(screen.getByRole('button', { name: 'Assign Visitor' }))

        // Clear clerk
        fireEvent.click(screen.getByRole('button', { name: 'Clear Visitor' }))

        expect(screen.queryByText('Bob')).toBeNull()
        expect(screen.getByText('Alice').parentElement?.children[1].textContent).toBe('1') // helped count should be 1
    })

    it('does not let a user assign a visitor to a clerk if no visitor is selected', () => {
        render(<Page />)

        // Add clerk
        fireEvent.change(screen.getByPlaceholderText('Enter clerk name'), { target: { value: 'Alice' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Clerk' }))

        // Try to assign visitor without selecting one
        fireEvent.click(screen.getByRole('button', { name: 'Assign Visitor' }))

        expect(screen.queryByRole('combobox')).toBeTruthy()
        expect(screen.queryByRole('button', { name: 'Assign Visitor' })).toBeTruthy() // button is still there
    })


    // QUESTION FOR WHOMEVER READS THIS:
    // Do I need to have these last two test cases? I already have confirmed in the model tests that the system behaves correctly
    // in such edge cases. I am only testing that the button doesn't exist to prevent such edge cases from even arising.

    it('does not let a user assign a visitor to a clerk if the clerk is already assigned', () => {
        render(<Page />)

        // Add clerk
        fireEvent.change(screen.getByPlaceholderText('Enter clerk name'), { target: { value: 'Alice' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Clerk' }))

        // Add visitor
        fireEvent.change(screen.getByPlaceholderText('Enter visitor name'), { target: { value: 'Bob' } })
        fireEvent.change(screen.getByPlaceholderText('Enter reason for visit'), { target: { value: 'New license plate' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Visitor' }))

        // Assign visitor to clerk
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } })
        fireEvent.click(screen.getByRole('button', { name: 'Assign Visitor' }))

        expect(screen.queryByRole('button', { name: 'Assign Visitor' })).toBeNull() // button is no longer there when visitor assigned
        expect(document.body.textContent.match("1 - Bob")).toHaveLength(1)
    })

    it('does not let a user remove a clerk with an assigned visitor', () => {
        render(<Page />)

        // Add clerk
        fireEvent.change(screen.getByPlaceholderText('Enter clerk name'), { target: { value: 'Alice' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Clerk' }))

        // Add visitor
        fireEvent.change(screen.getByPlaceholderText('Enter visitor name'), { target: { value: 'Bob' } })
        fireEvent.change(screen.getByPlaceholderText('Enter reason for visit'), { target: { value: 'New license plate' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add Visitor' }))

        // Assign visitor to clerk
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } })
        fireEvent.click(screen.getByRole('button', { name: 'Assign Visitor' }))

        expect(screen.queryByRole('button', { name: 'Remove Clerk' })).toBeNull() // button is no longer there when visitor assigned
        expect(screen.queryByText('Alice')).toBeTruthy()
    })
})