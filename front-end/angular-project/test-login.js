// Script para testar login no Angular via console
async function testAngularLogin() {
    console.log('Testing Angular login...');
    
    try {
        // Fazer login
        const loginResponse = await fetch('http://localhost:3300/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'aa',
                password: 'aa'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);
        
        if (loginData.token) {
            // Salvar token no localStorage
            localStorage.setItem('accessToken', loginData.token);
            console.log('Token saved to localStorage');
            
            // Testar busca de tasks
            const tasksResponse = await fetch('http://localhost:3300/tasks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.token}`
                }
            });
            
            const tasksData = await tasksResponse.json();
            console.log('Tasks response:', tasksData);
            
            return {
                loginSuccess: true,
                token: loginData.token,
                tasks: tasksData
            };
        }
    } catch (error) {
        console.error('Error in test:', error);
        return {
            loginSuccess: false,
            error: error.message
        };
    }
}

// Executar teste
testAngularLogin().then(result => {
    console.log('Test result:', result);
    
    if (result.loginSuccess) {
        console.log('✅ Login successful!');
        console.log('✅ Token saved!');
        console.log('✅ Tasks retrieved:', result.tasks);
        
        // Recarregar a página para testar o Angular
        setTimeout(() => {
            console.log('Reloading page to test Angular...');
            window.location.reload();
        }, 2000);
    } else {
        console.log('❌ Test failed:', result.error);
    }
});
