import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import { Search } from '@mui/icons-material';
import { useAppTheme } from '../../contexts/theme';
import { defaultValues } from '../../contexts/github/context';
import { useGithub } from '../../contexts/github';
import GitHubAPI from '../../api';

import { sx } from './styles';

const Header = () => {
  const [load, setLoad] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const { oppositeTheme, toggleTheme } = useAppTheme();
  const { setUserInfos } = useGithub();
  const { register, handleSubmit, setValue } = useForm();
  const [feedback, setFeedback] = useState({
    message: '',
    tooltip: ''
  });

  const clearFeedback = () => setFeedback({ message: '', tooltip: '' });

  const navigate = useNavigate();

  const theme = useTheme();
  const styles = sx(theme);

  const defaultValue = searchParams.get('user') || '';

  const fetchUser = async (username: string) => {

    setLoad(true);

    try {
      const { data: user } = await GitHubAPI.getUser(username);
      const { data: repos } = await GitHubAPI.getRepositorys(username);
      const { data: stars } = await GitHubAPI.getStars(username);

      setUserInfos({
        user,
        repos,
        stars,
      });
  
      setSearchParams((prevState) => {
        const newState = new URLSearchParams(prevState);
        newState.set('user', user.login);
        return newState;
      });

    } catch (error) {
      setFeedback({
        message: 'Nome de usuário inválido',
        tooltip: 'Usuário não encontrado',
      });

    } finally {
      setLoad(false);
    };
  };

  const onSubmit = async (data: { username: string }) => {

    if (data.username.trim() === '') {
      setFeedback({
        message: 'Nome de usuário inválido',
        tooltip: 'O nome de usuário não pode estar vazio',
      });

    } else {
      clearFeedback();
      fetchUser(data.username);
    };
  };

  useEffect(() => {
    if (defaultValue.length >= 1) {
      fetchUser(defaultValue);
    };
  }, []);

  const backToHomePage = () => {
    setValue('username', '');
    clearFeedback();
    setUserInfos(defaultValues.userInfos);
    navigate('/github-explorer/');
  };

  return (
    <Box sx={styles.wrapper}>

      <Box component='img' sx={styles.logo} src={`github-${oppositeTheme}.svg`} onClick={backToHomePage} />

      <form onSubmit={handleSubmit(onSubmit)}>

        <Box sx={styles.inputBox}>

          <TextField
            placeholder='Digite um usuário'
            defaultValue={defaultValue}
            size='small'
            type='text'
            name='username'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {
                    load ? <CircularProgress size='1rem' /> : (
                      <IconButton
                        onClick={handleSubmit(onSubmit)}
                        sx={styles.btnSearch}
                      >
                        <Search />
                      </IconButton>
                    )
                  }
                </InputAdornment>
              ),
            }}
            {...register('username')}
          />

          {
            feedback && (
              <Tooltip title={
                <Typography>
                  {feedback.tooltip}
                </Typography>
              }>
                <Typography sx={styles.feedback}>{feedback.message}</Typography>
              </Tooltip>
            )
          }
        </Box>
  
      </form>

      <IconButton onClick={toggleTheme}>
        <Brightness4OutlinedIcon />
      </IconButton>

    </Box>
  );
};

export default Header;
