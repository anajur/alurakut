import React, { useEffect, useState } from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { apiGit } from '../src/services';

function ProfileSideBar(props) {
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
    </Box>
  )
}

export default function Home() {
  const [seguidores, setSeguidores] = useState([]);
  const githubUser = 'anajur'
  const pessoasFavoritas = ['juunegreiros', 'peas', 'omariosouto']

  async function obterSeguidores() {
    const response = await apiGit.get(`/users/anajur/followers`);
    setSeguidores(response.data.slice(1, 7));
  }

  const totalSeguidores = seguidores.length > 0 ? seguidores.length : 0

  useEffect(() => {
    obterSeguidores();
  });

  return (
    <>
      <AlurakutMenu />
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
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map((item) => {
                return (
                  <li>
                    <a href={`/users/${item}`} key={item}>
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
              Seguidores ({totalSeguidores})
            </h2>
            <ul>
              {seguidores ?
                seguidores.map((item) => {
                  return (
                    <li>
                      <a href={`/users/${item.login}`} key={item.login}>
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
