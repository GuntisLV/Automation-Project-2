describe('Issue delete', () => {
    let issueTitle = "";
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.get('[data-testid="board-list:backlog').should('be.visible').within(() => {
                // Get the first issue from the backlog board, and save the issue title to variable
                cy.get('[data-testid="list-issue"]').first().find('p')
                .invoke("text")
                    .then((text) => {
                        issueTitle = text;
                    });
                // Open the first issue
                cy.get('[data-testid="list-issue"]').first().click();
            });
        });
    });

  it('Test 1 - Delete an issue from board and validate that it is deleted', () => {
    cy.get('[data-testid="icon:trash"]').click();
    // Deletion confirmation dialog should be visible
    cy.get('[data-testid="modal:confirm"]').should('be.visible').within(()=>{
        // Select Confirm delete button and click it
        cy.get('[class="sc-bwzfXH dIxFno sc-kGXeez bLOzZQ"]').click();
    });

    // Assert, that deletion confirmation dialogue is not visible.
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    // Waiting for page to remove the issue, since the load times are trash.
    cy.wait(15000);

    // Validate that the first issue is no longer present
    cy.get('[data-testid="board-list:backlog').should('be.visible')
        .contains("p", issueTitle)
        .should("not.exist");
  });

  it.only('Test 2 - cancel issue deletion in dialogue', () => {
    cy.get('[data-testid="icon:trash"]').click();
    // Deletion confirmation dialog should be visible
    cy.get('[data-testid="modal:confirm"]').should('be.visible').within(()=>{
        // Select Cancel button and click it
        cy.get('[class="sc-bwzfXH ewzfNn sc-kGXeez bLOzZQ"]').click();
    });

    // Assert, that deletion confirmation dialogue is not visible.
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[class="sc-bdVaJa fuyACr"][data-testid="icon:close"]').click();


    // Waiting for page to fully load, since the load times are trash.
    cy.wait(15000);

    // Validate that the issue still exists
    cy.get('[data-testid="board-list:backlog').should('be.visible')
        .contains("p", issueTitle)
        .should("exist");
  });
});
