describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should create a comment successfully', () => {
        const comment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });

    it('Should create,edit and delete comment successfully', () => {
        const comment = 'TEST_COMMENT';
        const comment_edited = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            //add comment
            cy.contains('Add a comment...').click();
            cy.get('textarea[placeholder="Add a comment..."]').type(comment);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);

            //edit comment
            cy.get('[data-testid="issue-comment"]').first().contains('Edit')
                .click().should('not.exist');
            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', comment).clear().type(comment_edited);
            cy.contains('button', 'Save').click().should('not.exist');
            cy.get('[data-testid="issue-comment"]').should('contain', 'Edit')
                .and('contain', comment_edited);

            //delete comment
            cy.contains('Delete').click();
        });

            cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete comment')
                .click().should('not.exist');
            getIssueDetailsModal().contains(comment_edited).should('not.exist');

    });

    it('Should create, edit and delete comment successfully 2', () => {
        const COMMENT = 'This is a comment'
        const EDITED_COMMENT = 'This is an edited comment'
        getIssueDetailsModal().within(()=>{
            /** ADD */
            // trigger the add a comment block with keydown
            cy.contains('Add a comment...')
                .trigger('keydown', { key: 'm', code: 'KeyM' })
                .type(COMMENT);

            pressButtonByText('Save');

            // assert that comment has been added
            doesCommentExistByText(COMMENT);


            /** EDIT */
            getFirstComment()
                .within(()=>{
                    cy.contains('Edit')
                        .click()
                        .should('not.exist');
                    cy.get('textarea[placeholder="Add a comment..."]')
                        .should('contain', COMMENT).clear().type(EDITED_COMMENT);
                        
                    pressButtonByText('Save');
                });
            
            // assert that comment has been edited
            doesCommentExistByText(EDITED_COMMENT);

            /** DELETE */
            getFirstComment()
                .within(()=>{
                    cy.contains('Delete')
                        .should('exist')
                        .click()
                });
        })
        
        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');
        // assert that comment has been deleted
        getIssueDetailsModal()
            .contains(EDITED_COMMENT)
            .should('not.exist');
    })

    // returns the first found comment
    const getFirstComment = () => {
        return cy.get('[data-testid="issue-comment"]')
            .first();
    }

    // clicks on a button found by text
    const pressButtonByText = (text) => {
        cy.contains(text)
            .should('exist')
            .click()
            .should('not.exist');
    }

    // checks if comment exists by text
    const doesCommentExistByText = (comment) => {
        cy.get('[data-testid="issue-comment"]').should('contain',comment);
    }

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });
});
