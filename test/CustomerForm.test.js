import React from 'react';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import ReactTestUtils from 'react-dom/test-utils';

describe('CustomerForm', () => {
    let render, container;
    beforeEach(() => {
        ({ render, container } = createContainer());
    });
    const form = id => container.querySelector(`form[id="${id}"]`);
    const expectToBeInputFieldOfTypeText = formElement => {
        expect(formElement).not.toBeNull();
        expect(formElement.tagName).toEqual('INPUT');
        expect(formElement.type).toEqual('text');
    };
    const field = name => form('customer').elements[name];
    it('renders a form', () => {
        render(<CustomerForm />);
        expect(form('customer')).not.toBeNull();
    });
    const labelFor = formElement =>
        container.querySelector(`label[for="${formElement}"]`);


    const itRendersAsATextBox = (fieldName) =>
        it('renders a text box', () => {
            render(<CustomerForm />);
            expectToBeInputFieldOfTypeText(field(fieldName));
        });

    const itIncludesTheExistingValue = (fieldName) =>
        it('includes the existing value', () => {
            render(<CustomerForm  { ...{[fieldName]: 'value'} } />);
            expect(field(fieldName).value).toEqual('value');
        });

    const itRendersALabel=(fieldName, label)=>
        it('renders a label', () => {
            render(<CustomerForm />);
            expect(labelFor(fieldName)).not.toBeNull();
            expect(labelFor(fieldName).textContent).toEqual(label);
        });

    const itAssignsAnIdThatMatchesTheLabelId =(fieldName) =>
        it('assigns an id that matches the label id', () =>
        {
            render(<CustomerForm />);
            expect(field(fieldName).id).toEqual(fieldName);
        });

    const itSubmitsExistingValue= (fieldName, value) =>
        it('saves existing when submitted', async () => {
            expect.hasAssertions();
            render(
                <CustomerForm
                    { ...{[fieldName]: 'value'} }
                    onSubmit={props =>
                        expect(props[fieldName]).toEqual('value')
                    }
                />
            );
            await ReactTestUtils.Simulate.submit(form('customer'));
        });

    const itSubmitsNewValue = (fieldName, value) =>
        it('saves new value when submitted', async () => {
            expect.hasAssertions();
            render(
                <CustomerForm
                    { ...{[fieldName]: 'existingValue'} }
                    onSubmit={props =>
                        expect(props[fieldName]).toEqual(value)
                    }
                />);
            await ReactTestUtils.Simulate.change(field(fieldName), {
                target: { value:value, name: fieldName }
            });
            await ReactTestUtils.Simulate.submit(form('customer'));
        });

    it('has a submit button', () => {
        render(<CustomerForm />);
        const submitButton = container.querySelector(
            'input[type="submit"]'
        );
        expect(submitButton).not.toBeNull();
    });

    describe('first name field', () => {
        itRendersAsATextBox('firstName');
        itIncludesTheExistingValue('firstName');
        itRendersALabel('firstName', 'First name');
        itAssignsAnIdThatMatchesTheLabelId('firstName');
        itSubmitsExistingValue('firstName', 'firstName');
        itSubmitsNewValue('firstName', 'anotherFirstName');
    });

    describe('last name field', () => {
        itRendersAsATextBox('lastName');
        itIncludesTheExistingValue('lastName');
        itRendersALabel('lastName', 'Last name');
        itAssignsAnIdThatMatchesTheLabelId('lastName');
        itSubmitsExistingValue('lastName', 'lastName');
        itSubmitsNewValue('lastName', 'anotherLastName');
    });

    describe('phone number field', () => {
        itRendersAsATextBox('phoneNumber');
        itIncludesTheExistingValue('phoneNumber');
        itRendersALabel('phoneNumber', 'Phone number');
        itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
        itSubmitsExistingValue('phoneNumber', '123456789');
        itSubmitsNewValue('phoneNumber', '987456123');
    });

});