import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import Popover from '@mui/material/Popover';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Button, Typography } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { OptionType } from '../../types/githubContext';

import { sx }from './styles';

type PropsPopover = {
  title: 'Tipo' | 'Linguagem' | 'Ordem';
  label: string;
  options: OptionType[];
  setOptions: Dispatch<SetStateAction<OptionType[]>>;
};

const BasicPopover= ({  title, label, options, setOptions }: PropsPopover) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleSelectedOption = (selectedOption: string) => {

    setOptions((prevOptions) => {
      return prevOptions.map((option) => {

        if (option.option === selectedOption) {
          return { ...option, check: true };
        }

        return { ...option, check: false };
      });
    });
  };
  

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        variant='text'
        size='small'
      >
        {title}
        <ArrowDropDownIcon />
      </Button>
  
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: -10,
          horizontal: 'right',
        }}
        anchorPosition={{
          top: 104,
          left: 20,
        }}
      >
        <Box sx={sx.wrapperContent}>

          <Box sx={sx.headerContent}>

            <Typography>{label}</Typography>

            <Close onClick={handleClose} sx={sx.headerIcon} />

          </Box>

          {
            options.map(({ option, check }) => (
              <Box
                component='label'
                sx={sx.optionContent}
                key={option}
                onClick={() => handleSelectedOption(option)}
              >
                <Box sx={sx.checkContent}>
                  {check && <Check sx={sx.checkIcon} />}
                </Box>

                <Typography>{option}</Typography>
              </Box>
            ))
          }
 
        </Box>
      </Popover>
    </>
  );
};

export default BasicPopover;
