import React, { useState } from 'react';
import { apiAlura } from '../src/services';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import Head from 'next/head'


export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = useState('anajur');

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Head>
        <title>Alurakut - Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="https://cdn.icon-icons.com/icons2/122/PNG/512/orkut_socialnetwork_20026.png" />
      </Head>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            async function enviar() {
              const response = await apiAlura.post('/api/login', ({ githubUser: githubUser }))
              const token = response.data.token;
              nookies.set(null, 'USER_TOKEN', token, {
                path: '/',
                maxAge: 86400 * 7
              })
              router.push('/')

            }
            enviar();
          }}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input
              placeholder="Usuário"
              value={githubUser}
              onChange={(evento) => {
                setGithubUser(evento.target.value)
              }}
            />
            {githubUser.length === 0
              ? 'Preencha o campo'
              : ''
            }
            <button type="submit">
              Login
            </button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>
                  ENTRAR JÁ
                </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
}