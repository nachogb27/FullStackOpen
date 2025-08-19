describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.get('button').contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input').first().type('mluukkai')      
      cy.get('input').last().type('salainen')     
      cy.get('button').contains('login').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input').first().type('mluukkai')    
      cy.get('input').last().type('wrong')          
      cy.get('button').contains('login').click()

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
      cy.contains('log in to application')  
    })

describe('When logged in', function() {
    beforeEach(function() {
      
      cy.get('input').first().type('mluukkai')
      cy.get('input').last().type('salainen')
      cy.get('button').contains('login').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new').click()
      
      cy.get('input[placeholder*="title"]').type('A new blog created by cypress')
      cy.get('input[placeholder*="author"]').type('Cypress Test')
      cy.get('input[placeholder*="url"]').type('https://cypress.example.com')
      
      cy.get('form').find('button').contains('create').click()
      
    })

    it('A blog can be liked', function() {
      cy.contains('create new').click()
      cy.get('input').eq(0).type('A blog to be liked')
      cy.get('input').eq(1).type('Test Author')  
      cy.get('input').eq(2).type('https://test.example.com')
      cy.get('form').find('button').contains('create').click()
      
      cy.contains('A blog to be liked')
      
      cy.contains('A blog to be liked').parent().find('button').contains('view').click()
      
      cy.contains('likes').should('be.visible')
      
      cy.contains('A blog to be liked').parent().find('button').contains('like').click()
      
      cy.contains('likes 1')
    })

     it('A blog can be deleted by the user who created it', function() {

      cy.contains('create new').click()
    cy.get('input').eq(0).type('A blog to be deleted')
    cy.get('input').eq(1).type('Test Author')  
    cy.get('input').eq(2).type('https://test.example.com')
    cy.get('form').find('button').contains('create').click()
    
    cy.contains('A blog to be deleted')
    
    cy.contains('A blog to be deleted').parent().find('button').contains('view').click()
    
    cy.contains('A blog to be deleted').parent().find('button').contains('remove').click()
  })

    it('Blogs are ordered according to likes', function() {

      cy.contains('create new').click()
    cy.get('input').eq(0).type('Blog with most likes')
    cy.get('input').eq(1).type('Author One')  
    cy.get('input').eq(2).type('https://most-likes.example.com')
    cy.get('form').find('button').contains('create').click()
    cy.contains('Blog with most likes')

    cy.contains('create new').click()
    cy.get('input').eq(0).type('Blog with medium likes')
    cy.get('input').eq(1).type('Author Two')  
    cy.get('input').eq(2).type('https://medium-likes.example.com')
    cy.get('form').find('button').contains('create').click()
    cy.contains('Blog with medium likes')

    cy.contains('create new').click()
    cy.get('input').eq(0).type('Blog with least likes')
    cy.get('input').eq(1).type('Author Three')  
    cy.get('input').eq(2).type('https://least-likes.example.com')
    cy.get('form').find('button').contains('create').click()
    cy.contains('Blog with least likes')

    cy.contains('Blog with most likes').parent().find('button').contains('view').click()
    for (let i = 0; i < 5; i++) {
      cy.contains('Blog with most likes').parent().find('button').contains('like').click()
      cy.wait(500) 
    }

    cy.contains('Blog with medium likes').parent().find('button').contains('view').click()
    for (let i = 0; i < 3; i++) {
      cy.contains('Blog with medium likes').parent().find('button').contains('like').click()
      cy.wait(500)
    }

    cy.contains('Blog with least likes').parent().find('button').contains('view').click()
    cy.contains('Blog with least likes').parent().find('button').contains('like').click()

    cy.get('.blog').eq(0).should('contain', 'Blog with most likes')
    cy.get('.blog').eq(1).should('contain', 'Blog with medium likes')
    cy.get('.blog').eq(2).should('contain', 'Blog with least likes')
  })
  })
})
})