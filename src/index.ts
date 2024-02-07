interface GithubUser {
    id:number,
    login:string,
    name:string,
    bio:string,
    public_repos:number,
    repos_url:string,
    message?:"Not found"
}

interface GithubRepo {
    name:string,
    description:string,
    fork:boolean,
    stargazers_count:number
}

const users:GithubUser[] = [];

let aux:string;
async function fetchUser(username:string){
    const response = await fetch(`https://api.github.com/users/${username}`);

    let userAsUser:GithubUser = await response.json();
    
    if(userAsUser.message){
        if(aux){
            document.querySelector('#usernameInput').value=aux;
        } else {
            document.querySelector('#usernameInput').value='';
        }
        document.querySelector('.resultados').style.display='none'
        document.querySelector('h1').style.display='block'
    } else {
        document.querySelector('h1').style.display='none'
        aux=username;
        if(users.every(u=>u.login!=userAsUser.login)){
            users.push(userAsUser);
        } else {
            alert("Usuário já cadastrado, repositórios públicos não serão novamente acrescentados ao total!");
        }
        document.querySelector('#userid').innerHTML=userAsUser.id;
        document.querySelector('#userlogin').innerHTML=userAsUser.login;
        document.querySelector('#username').innerHTML=userAsUser.name;
        document.querySelector('#userbio').innerHTML=userAsUser.bio;
        document.querySelector('#userrepos').innerHTML=userAsUser.public_repos;
        document.querySelector('#totalRepos').innerHTML=sumRepos();
    }
}

async function showUser(username:string) {
    const user:GithubUser = users.find(u=>u.login===username);
    if(typeof user ==='undefined'){
        console.log('Usuário não encontrado');
    } else {
        const response = await fetch(user.repos_url);
        const repos:GithubRepo[] = await response.json();
        let message = `
        id: ${user.id}\n
        nome: ${user.name}\n
        login: ${user.login}\n
        bio: ${user.bio}\n
        repositórios públicos: ${user.public_repos}`

        repos.forEach(repository =>{
            message+= `\nNome: ${repository.name}\n
            Descrição: ${repository.description}\n
            Estrelas: ${repository.stargazers_count}\n
            Fork: ${repository.fork?'Sim':'Não'}`
        })
        console.log(message);
    }
}
document.querySelector('input[type="submit"]').addEventListener('click', (e)=>{
    e.preventDefault();
    const user:string = document.querySelector('#usernameInput').value;
    fetchUser(user);
    setTimeout(()=>showUser(user),300);
    document.querySelector('.resultados').style.display='block';
})

function sumRepos ():number {
    let sum:number = 0;
    users.forEach(ghUser=>sum+=ghUser.public_repos)
    return sum;
}

function showAllUsers () {
    users.forEach(us=>{
        alert(`
        id: ${us.id}
        Login: ${us.login}
        Nome: ${us.name?us.name:''}
        Bio: ${us.bio?us.bio:''}
        Repositórios públicos: ${us.public_repos}`)
    })
}

function showTopThree () {
    const topthree = [...users].sort((a,b)=>b.public_repos-a.public_repos).slice(0,3);
    let message = `Top 3 usuários: \n`
    topthree.forEach((user, index) => {
        message+= `${index+1} - ${user.login}: ${user.public_repos} repositórios\n`
    })
    alert(message)
}

document.querySelector('#showTopUsers').addEventListener('click', showTopThree)
document.querySelector('#showUsers').addEventListener('click', showAllUsers);