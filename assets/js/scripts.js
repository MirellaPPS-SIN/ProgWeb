// Inicializando o Parse
Parse.initialize("ssj4SVeAvPGwGKK82M7QknL4G0xItCq1vYSp2k4H", "qWARIcypxFu1czaoyjktNfqAaa3DNPjBUA9lXW31");
Parse.serverURL = 'https://parseapi.back4app.com/';

// Função para redirecionar entre login e registro
document.getElementById('goToRegister').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'block';
});

document.getElementById('goToLogin').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('loginSection').style.display = 'block';
});

// Função de registro
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await Parse.User.logOut();
  } catch (logoutError) {
    console.warn('Erro ao deslogar antes de registrar:', logoutError.message);
  }

  const user = new Parse.User();
  user.set('username', username);
  user.set('email', email);
  user.set('password', password);

  try {
    await user.signUp();
    alert('Cadastro bem-sucedido!');
    document.getElementById('goToLogin').click();
  } catch (error) {
    alert('Erro ao registrar: ' + error.message);
  }
});

// Função de login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const user = await Parse.User.logIn(username, password);
    showDashboard(user);
  } catch (error) {
    alert('Erro ao fazer login: ' + error.message);
  }
});

// Logout
document.getElementById('logoutButton').addEventListener('click', async () => {
  try {
    await Parse.User.logOut();
    alert('Logout realizado com sucesso!');
    window.location.reload();
  } catch (error) {
    console.error('Erro ao deslogar:', error.message);
    alert('Erro ao deslogar. Tente novamente.');
  }
});

// Dashboard
function showDashboard(user) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('dashboardSection').style.display = 'block';
  displayWeather(); // Carregar dados climáticos
}

// Função para buscar e exibir informações climáticas
async function displayWeather() {
  const apiKey = '7cac96ee29a0ad9aef04f0af4295038a'; // Substitua pela sua chave da OpenWeather
  const city = 'Recife'; // Cidade para consulta
  const units = 'metric'; // Celsius
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const temperature = data.main.temp;
      const weather = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      const weatherInfo = document.getElementById('weatherInfo');
      weatherInfo.innerHTML = `
        <p><strong>Temperatura:</strong> ${temperature}°C</p>
        <p><strong>Condição:</strong> ${weather}</p>
        <p><strong>Umidade:</strong> ${humidity}%</p>
        <p><strong>Velocidade do vento:</strong> ${windSpeed} m/s</p>
      `;
    } else {
      throw new Error(data.message || 'Erro ao buscar os dados climáticos');
    }
  } catch (error) {
    document.getElementById('weatherInfo').innerHTML = `
      <p>Erro ao carregar as informações do clima: ${error.message}</p>
    `;
    console.error('Erro ao conectar com a API OpenWeather:', error.message);
  }
}
