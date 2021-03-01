describe('Usquad UI Test', () => {
    it('Load Players', () => {
        cy.visit('http://localhost:8000/');
        cy.get('#add-player').click();

        //cy.get('#sub-topic').click(); 
        cy.get('#sub-topic').type('usquad');
        cy.get('#subscribe-button').click();

        cy.get('#pub-topic').type('usquad');
        cy.get('#pub-payload').type('add TestPlayer');
        cy.get('#publish-button').click();

        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('skin 0 alienA');
        cy.get('#publish-button').click();

        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('skin 0 alienB');
        cy.get('#publish-button').click();

        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('anim 0 Run');
        cy.get('#publish-button').click();

        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('say 1 Hello World!');
        cy.get('#publish-button').click();
    })
})