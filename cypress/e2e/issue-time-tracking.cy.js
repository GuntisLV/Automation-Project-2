describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Adding estimation, editing estimation, removing estimation', () => {
        const hours = '9999';
        const hours_edited = '123';

        getIssueDetailsModal().within(() => {
            // add estimated 
            getEstimatedInputAndClickAndType(hours)
            assertEstimatedValueHasChanged(hours + 'h estimated')


            // edit estimated
            getEstimatedInputAndClickAndType(hours_edited)
            assertEstimatedValueHasChanged( hours_edited + 'h estimated');

            //remove estimated
            getEstimatedInputAndClickAndClear()
            assertEstimatedValueHasChangedToBlank()
        });
    });

    it('Add, edit, remove time log', () => {
        const hours = '123';
        const hours2 = '145';
        const hours3 = '444';
        const hours4 = '555';
        
        // Add time log
        addTimeLog(hours, hours2)
        cy.log('Added time log succesfully')

        // Edit time log
        addTimeLog(hours3, hours4)
        cy.log('Edited time log succesfully')
       
        //Remove time log
        getIssueDetailsModal().within(() => {
            openTimeLoggingModal();
        })

        getModal().within(()=>{
            getInputs().eq(0).click().clear()
            getInputs().eq(1).click().clear()
            clickDone()
        })
        getIssueDetailsModal().within(() => {
            assertEstimatedValueHasChangedToBlank('h logged');
            assertEstimatedValueHasChangedToBlank('h remaining');
        })
        cy.log('Removed time log succesfully')
    });

    const  getEstimatedInputAndClickAndClear = () => 
    {
        cy.get('input[placeholder="Number"]')
            .click()
            .clear()
    }

    const  getEstimatedInputAndClickAndType = (string) => 
    {
        cy.get('input[placeholder="Number"]')
            .click()
            .clear().type(string)
    }

    const assertEstimatedValueHasChanged = (value) => {
        cy.get('[class="sc-rBLzX irwmBe"]').should('contain', value);
    }
    
    
    const assertEstimatedValueHasChangedToBlank = (string = 'h estimated') => {
        cy.get('[class="sc-rBLzX irwmBe"]').should('not.contain', string);
    }

    const openTimeLoggingModal = () => 
    {
        cy.get('[class="sc-bMvGRv IstSR"]')
            .click()
    }

    const getModal = () => cy.get('[data-testid="modal:tracking"]')

    const getInputs = () => cy.get('[class="sc-dxgOiQ HrhWu"]') 

    const clickDone = () =>
    {
        cy.get('[class="sc-bxivhb rljZq"]')
            .click()
    }

    const addTimeLog = (hours, hours2) => 
    {
        getIssueDetailsModal().within(() => {
            openTimeLoggingModal();
        })

        getModal().within(()=>{
            getInputs().eq(0).click().clear().type(hours)
            getInputs().eq(1).click().clear().type(hours2)
            clickDone()
        })

        getIssueDetailsModal().within(() => {
            assertEstimatedValueHasChanged(hours + 'h logged');
            assertEstimatedValueHasChanged(hours2 + 'h remaining');
        })
    }
})
