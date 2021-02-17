describe('Usquad UI Test', () => {
    it('Load Players', () => {
        cy.visit('http://localhost:8000/');
        cy.get('#add-player').click();
        cy.get('#sub-topic').click();
        cy.get('#sub-topic').type('usquad');
        cy.get('#subscribe-button').click();
        cy.get('#pub-topic').click();
        cy.get('#pub-topic').type('usquad');
        cy.get('#pub-payload').click();
        cy.get('#pub-payload').type('add TestPlayer');
        cy.get('#publish-button').click();
    })
})