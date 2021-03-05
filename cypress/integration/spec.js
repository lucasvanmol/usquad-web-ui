describe('Usquad UI Test', () => {
    it('Loads player models', () => {
        cy.visit('http://localhost:8000/');
        cy.get('#add-player').click();
    })

    it('Can run player commands', () => {
        cy.visit('http://localhost:8000/');

        cy.get('#pub-topic').type('players/playerA');
        cy.get('#pub-payload').type('add');
        cy.get('#publish-button').click();

        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('skin,alienA');
        cy.get('#publish-button').click();

        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('acc,cap');
        cy.get('#publish-button').click();

        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('anim,Run');
        cy.get('#publish-button').click();

        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('say,Hello!');
        cy.get('#publish-button').click();
    })

    it('Can run team commands', () => {
        cy.visit('http://localhost:8000/');

        cy.get('#pub-topic').type('players/playerA');
        cy.get('#pub-payload').type('add');
        cy.get('#publish-button').click();

        cy.get('#pub-topic').clear();
        cy.get('#pub-topic').type('players/playerB');
        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('add');
        cy.get('#publish-button').click();

        cy.get('#pub-topic').clear();
        cy.get('#pub-topic').type('players/playerC');
        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('add');
        cy.get('#publish-button').click();

        cy.get('#pub-topic').clear();
        cy.get('#pub-topic').type('players/playerA');
        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('team,teamA');
        cy.get('#publish-button').click();

        cy.get('#pub-topic').clear();
        cy.get('#pub-topic').type('players/playerB');
        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('team,teamB');
        cy.get('#publish-button').click();

        cy.get('#pub-topic').clear();
        cy.get('#pub-topic').type('players/playerC');
        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('team,teamA');
        cy.get('#publish-button').click();

        cy.get('#pub-topic').clear();
        cy.get('#pub-topic').type('teams/teamA');
        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('anim,Run');
        cy.get('#publish-button').click();

        cy.get('#pub-topic').clear();
        cy.get('#pub-topic').type('teams/teamB');
        cy.get('#pub-payload').clear();
        cy.get('#pub-payload').type('anim,CrouchIdle');
        cy.get('#publish-button').click();
    })
})