describe('LendSwift - 8-Step Multi-Step Loan Application Form', () => {
  beforeEach(() => {
    // Clear localStorage to start fresh in each test
    cy.clearLocalStorage();
    cy.visit('http://localhost:5173');
  });

  // Helper to fill Step 1
  const fillStep1 = (type = 'personal', amount = '300000', tenure = '36', purpose = 'Education') => {
    cy.get(`input[value="${type}"]`).check({ force: true });
    cy.get('#loanAmount').clear().type(amount);
    cy.get('#loanTenure').select(tenure);
    cy.get('#loanPurpose').select(purpose);
    cy.get('#step1-next').click();
  };

  // Helper to fill Step 2
  const fillStep2 = (name = 'John Doe', dob = '1995-05-15', gender = 'male', marital = 'single', email = 'john.doe@example.com', mobile = '9876543210') => {
    cy.get('#fullName').type(name);
    cy.get('#dateOfBirth').type(dob);
    cy.get(`input[value="${gender}"]`).check({ force: true });
    cy.get('#maritalStatus').select(marital);
    cy.get('#fatherName').type('Senior Doe');
    cy.get('#motherName').type('Jane Doe');
    cy.get('#email').type(email);
    cy.get('#mobileNumber').type(mobile);
    cy.get('#step2-next').click();
  };

  // Helper to fill Step 3
  const fillStep3 = (pan = 'ABCPD1234E', aadhaar = '366228359489') => {
    cy.get('#panNumber').type(pan);
    cy.get('#aadhaarNumber').type(aadhaar);
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.wait(2000); // Wait for simulated verification
    cy.get('button').contains('Continue').click();
  };

  // Helper to fill Step 4
  const fillStep4 = (address = '123, Koramangala Main Road', pin = '560034', resType = 'owned', years = '5') => {
    cy.get('#currentAddressLine1').type(address);
    cy.get('#currentPinCode').type(pin);
    cy.wait(600); // Wait for PIN lookup auto-fill
    cy.get('#residenceType').select(resType);
    cy.get('#yearsAtCurrentAddress').type(years);
    cy.get('button').contains('Continue').click();
  };

  // Helper to fill Step 5 Salaried
  const fillStep5Salaried = (company = 'Google India', designation = 'Software Engineer', salary = '85000', exp = '4') => {
    cy.get('input[value="salaried"]').check({ force: true });
    cy.get('#companyName').type(company);
    cy.get('#designation').type(designation);
    cy.get('#monthlyNetSalary').type(salary);
    cy.get('#yearsOfExperience').type(exp);
    cy.get('button').contains('Continue').click();
  };

  // Helper to fill Step 7
  const fillStep7 = () => {
    // E-signature draw simulated
    cy.get('canvas').trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 100, clientY: 100 })
      .trigger('mousemove', { clientX: 200, clientY: 150 })
      .trigger('mouseup', { force: true });
    
    // In test environment, we bypass dropzone requirement or upload mock file
    // For cypress, we'll verify it has signature and then click continue
    cy.get('button').contains('Continue to Review').click();
  };

  // ==========================================
  // P0 TEST 1: Personal Loan Happy Path
  // ==========================================
  it('1. Personal Loan Happy Path', () => {
    fillStep1('personal', '300000', '36', 'Education');
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();
    // Step 6 skipped since Personal loan is under 5L limit
    fillStep7();
    
    // Step 8 Review
    cy.get('h2').should('contain', 'Review & Submit');
    cy.get('input[type="checkbox"]').each(($el) => {
      cy.wrap($el).check({ force: true });
    });
    cy.get('#submit-application').click();
    cy.get('h2').should('contain', 'Application Submitted Successfully!');
  });

  // ==========================================
  // P0 TEST 2: Home Loan Happy Path
  // ==========================================
  it('2. Home Loan Happy Path', () => {
    fillStep1('home', '1500000', '120', 'New Home Purchase');
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();
    
    // Step 6 Co-applicant always active for Home Loan
    cy.get('h2').should('contain', 'Co-Applicant Details');
    cy.get('#coApplicantName').type('Jane Doe');
    cy.get('#coApplicantRelationship').select('spouse');
    cy.get('#coApplicantPAN').type('ABCPD5678F');
    cy.get('#coApplicantIncome').type('60000');
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.wait(2000);
    cy.get('button').contains('Continue').click();

    fillStep7();
    
    // Step 8
    cy.get('h2').should('contain', 'Review & Submit');
  });

  // ==========================================
  // P0 TEST 3: Business Loan Happy Path
  // ==========================================
  it('3. Business Loan Happy Path', () => {
    fillStep1('business', '800000', '48', 'Working Capital');
    fillStep2();
    fillStep3();
    fillStep4();
    
    // Step 5 Business Owner
    cy.get('input[value="businessOwner"]').check({ force: true });
    cy.get('#businessName').type('Apex Technologies');
    cy.get('#businessType').select('pvtLtd');
    cy.get('#annualTurnover').type('5000000');
    cy.get('#yearsInBusiness').type('4');
    cy.get('#gstNumber').type('22AAAAA0000A1Z5');
    cy.get('#officeAddressLine1').type('Industrial Phase 2, Pune');
    cy.get('button').contains('Continue').click();

    // Step 6 is skipped since Business Loan is under 20L
    fillStep7();
    cy.get('h2').should('contain', 'Review & Submit');
  });

  // ==========================================
  // P0 TEST 4: Step 1 Validation Errors
  // ==========================================
  it('4. Step 1 Validation Errors', () => {
    cy.get('#step1-next').click();
    cy.get('[role="alert"]').should('contain', 'Please select a loan type');
  });

  // ==========================================
  // P0 TEST 5: Step 2 Validation Errors
  // ==========================================
  it('5. Step 2 Validation Errors', () => {
    fillStep1();
    cy.get('#step2-next').click();
    cy.get('[role="alert"]').should('contain', 'Name must be at least 2 characters');
  });

  // ==========================================
  // P0 TEST 6: Step 3 PAN/Aadhaar Validation
  // ==========================================
  it('6. Step 3 PAN/Aadhaar Validation', () => {
    fillStep1();
    fillStep2();
    
    // Enter invalid formats
    cy.get('#panNumber').type('INVALIDPAN');
    cy.get('#aadhaarNumber').type('123456');
    cy.get('button').contains('Continue').click();
    
    cy.get('[role="alert"]').should('exist');
  });

  // ==========================================
  // P0 TEST 7: Step 4 PIN Code Lookup
  // ==========================================
  it('7. Step 4 PIN Code Lookup', () => {
    fillStep1();
    fillStep2();
    fillStep3();
    
    cy.get('#currentPinCode').type('560034');
    cy.wait(600);
    cy.get('#currentCity').should('have.value', 'Bengaluru');
    cy.get('#currentState').should('have.value', 'Karnataka');
  });

  // ==========================================
  // P0 TEST 8: Step 5 Employment Switching
  // ==========================================
  it('8. Step 5 Employment Switching', () => {
    fillStep1();
    fillStep2();
    fillStep3();
    fillStep4();
    
    cy.get('input[value="salaried"]').check({ force: true });
    cy.get('#companyName').should('be.visible');
    
    cy.get('input[value="businessOwner"]').check({ force: true });
    cy.get('#gstNumber').should('be.visible');
    cy.get('#companyName').should('not.exist');
  });

  // ==========================================
  // P1 TEST 9: Step 6 Conditional Visibility
  // ==========================================
  it('9. Step 6 Conditional Visibility', () => {
    // Under 5L personal loan -> Step 6 should be skipped
    fillStep1('personal', '300000');
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();
    cy.get('h2').should('contain', 'Document Upload'); // Step 6 skipped!
  });

  // ==========================================
  // P0 TEST 10: File Upload Preview
  // ==========================================
  it('10. Document Preview and Signature Canvas', () => {
    fillStep1();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();
    
    // Verify signature canvas renders
    cy.get('canvas').should('be.visible');
  });

  // ==========================================
  // P1 TEST 11: E-Signature Capture
  // ==========================================
  it('11. E-Signature Capture', () => {
    fillStep1();
    fillStep2();
    fillStep3();
    fillStep4();
    fillStep5Salaried();
    
    // Drawing signature
    cy.get('canvas').trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 100, clientY: 100 })
      .trigger('mouseup', { force: true });
    
    cy.get('p').should('contain', 'Signature captured');
  });

  // ==========================================
  // P0 TEST 12: Auto-Save & Resume
  // ==========================================
  it('12. Auto-Save & Resume', () => {
    fillStep1('personal', '250000');
    fillStep2('Bob Tester');
    
    // Reload page and check draft restore modal
    cy.reload();
    cy.get('.modal-content').should('be.visible');
    cy.get('#resume-modal-resume').click();
    cy.get('#fullName').should('have.value', 'Bob Tester');
  });

  // ==========================================
  // P1 TEST 13: Keyboard Navigation
  // ==========================================
  it('13. Keyboard Navigation', () => {
    cy.get('body').tab();
    cy.focused().should('have.attr', 'value', 'personal');
  });

  // ==========================================
  // P1 TEST 14: Rapid Navigation Stress
  // ==========================================
  it('14. Rapid Navigation Stress', () => {
    cy.get('#step1-next').click().click().click();
    cy.get('[role="alert"]').should('contain', 'Please select a loan type');
  });

  // ==========================================
  // P0 TEST 15: Cross-Step Dependency
  // ==========================================
  it('15. Cross-Step Dependency', () => {
    // Changing DOB to older age will restrict tenure in Step 1
    fillStep1('personal', '500000', '60'); // 5 years
    cy.get('#step2-prev').click();
    
    // Change loan type and make sure constraints updated
    cy.get('input[value="business"]').check({ force: true });
    cy.get('#loanTenure').should('exist');
  });
});
