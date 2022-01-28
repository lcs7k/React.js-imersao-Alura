import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'


// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyODc0MywiZXhwIjoxOTU4OTA0NzQzfQ.dLGY0guoZ9Q8-jIuWuural4azN12-d8Q2t_oAW9wf8k';
const SUPABASE_URL = 'https://yruwqnfdlarhpbglcqdm.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export default function ChatPage() {
    const [mensagem, setMensagem] = useState('');
    const [mensagemList, setMensagemList] = useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        supabaseClient
          .from('mensagens')
          .select('*')
          .order('id', { ascending: false })
          .then(({ data }) => {
            console.log('Dados da consulta:', data);
            setMensagemList(data);
            setLoading(true);
          });
      }, []);

    /*
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
    - [X] Lista de mensagens 
    */
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            //id: mensagemList.length + (Math.random() * 100),
            user: 'Lcs7k',
            text: novaMensagem,
        };

        supabaseClient
        .from('mensagens')
        .insert([
          // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
          mensagem
        ])
        .then(({ data }) => {


        setMensagemList([
            mensagem,
            ...mensagemList,
        ]);
        setMensagem('');
    
        });

        }
        if (loading === false) {
            return (
                <>
                    <Box
                        styleSheet={{
                            
                            backgroundColor: appConfig.theme.colors.primary[500],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            
                            
                        }}
                    >
                        <img className='load'  src='http://papeisdeparedeparacelular.org/images/gif-escudo-fla-3d.gif' />
                    </Box>
                </>
            )
        }

        function handleDeleteMensagem(event) {
            const mensagemId = Number(event.target.dataset.id)
            const mensagemListFilter = mensagemList.filter((mensagemFilter) => {
    
                return mensagemFilter.id != mensagemId
    
            })
    
            setMensagemList(mensagemListFilter)
    
        }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundImage:'url(https://radiolitoranea.com.br/wp-content/uploads/2019/03/painel-flamengo-1x0-0-decoracao-parede-festa.jpg)',
                    backgroundSize:'cover',
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MensagemList mensagemList={mensagemList} handleDeleteMensagem={handleDeleteMensagem} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                setMensagem(event.target.value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button

                            onClick={() => handleNovaMensagem(mensagem)}
                            label='Enviar'
                            fullWidth
                            styleSheet={{
                                maxWidth: '100px',
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}

                        />
                      </Box>
                 </Box>
             </Box>
         </Box>
         )
      }


     function Header() {
     return (
             <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    label='Sair'
                    href="/"
                    buttonColors={{
                        contrastColor: appConfig.theme.colors.neutrals["000"],
                        mainColor: appConfig.theme.colors.primary[500],
                        mainColorLight: appConfig.theme.colors.primary[400],
                        mainColorStrong: appConfig.theme.colors.primary[600],
                    }}
                />
            </Box>
          </>
           )
        }

     function MensagemList(props) {
         
        const handleDeleteMensagem = props.handleDeleteMensagem

     return (
            <Box
                tag="ul"
                styleSheet={{
                overflow: 'auto',    
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagemList.map((mensagemItem) => {
                return (
                    <Text
                        key={mensagemItem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            wordBreak: 'break-word',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagemItem.user}.png`}
                            />
                            <Text tag="strong">
                                {mensagemItem.user}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Text

                            onClick={handleDeleteMensagem}

                            styleSheet={{

                                fontSize: '10px',
                                fontWeight: 'bold',
                                marginLeft: 'auto',
                                color: '#FFF',
                                backgroundColor: 'rgba(0,0,0,.5)',
                                width: '20px',
                                height: '20px',
                                borderRadius: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                            tag="span"
                            data-id={mensagemItem.id}
                    >

                        X

                        </Text>

                        </Box>
                            {mensagemItem.text}
                        </Text>
                    )

                })
            }

        </Box>
    )

}

