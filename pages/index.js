import React, { useEffect, useState } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { apiGit, apiGraphql, api } from '../src/services';
import nookies from 'nookies';
import { apiAlura } from '../src/services';
import jwt from 'jsonwebtoken';
import Head from 'next/head'


function ProfileRelationsBox(props) {
  const { list, title } = props;
  return (
    <ProfileRelationsBoxWrapper >
      <h2 className="smallTitle">
        {title} ({list.length})
      </h2>
      <ul>
        {
          list.map((item) => {
            return (
              <li id={item.id}>
                <a href={`/users/${item}`} >
                  <img src={`https://github.com/${item}.png`} />
                  <span>{item}</span>
                </a>
              </li>
            )
          })
        }
      </ul>
    </ProfileRelationsBoxWrapper>
  )

}

function ProfileSideBar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home(props) {
  const [seguidores, setSeguidores] = useState([]);
  const [comunidades, setComunidades] = useState([]);

  const githubUser = props.githubUser;

  const totalSeguidores = seguidores.length > 0 ? seguidores.length : 0

  useEffect(() => {
    apiGit.get(`/users/anajur/followers`)
      .then(response => setSeguidores(response.data));

    apiGraphql.post('/',
      JSON.stringify({
        "query": ` query {
    allCommunities {
      title
      id
      imageUrl
      creatorSlug
    }
   }` })
    ).then(response => setComunidades(response.data.data.allCommunities));


  }, [])

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <Head>
        <title>Alurakut - Home</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="https://cdn.icon-icons.com/icons2/122/PNG/512/orkut_socialnetwork_20026.png" />
      </Head>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box >
            <h1 className="title">
              Bem vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriarComunidade(e) {
              //evita de ir para outra pagina quando submeter o forms
              e.preventDefault();

              const dadosDoForm = new FormData(e.target);
              const comunidade = {
                id: new Date().toISOString,
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser
              }
              async function salvar() {
                const response = await api.post('', comunidade).then(response => {
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas)
                })

              }
              salvar();

            }}>
              <div>

                <input
                  placeholder="Qual  vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual  vai ser o nome da sua comunidade"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>
                Criar comunidade
              </button>

            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
              minhas comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades ?
                comunidades.map((item) => {
                  return (
                    <li id={item.id}>
                      <a href={`/users/${item.title}`} key={item.title}>
                        <img src={item.imageUrl} />
                        <span>{item.title}</span>
                      </a>
                    </li>
                  )
                })
                : <> </>
              }
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
              meus amigos ({totalSeguidores})
            </h2>
            <ul>
              {seguidores ?
                seguidores.slice(1, 7).map((item) => {
                  return (
                    <li key={item.login}>
                      <a href={`/users/${item.login}`}>
                        <img src={`${item.avatar_url}`} />
                        <span>{item.login}</span>
                      </a>
                    </li>
                  )
                })
                : <> </>
              }
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const response = await apiAlura.post('/api/auth', '', {
    headers: {
      Authorization: token
    }
  })
  const isAuthenticated = response.data.isAuthenticated;
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    },
  }
}