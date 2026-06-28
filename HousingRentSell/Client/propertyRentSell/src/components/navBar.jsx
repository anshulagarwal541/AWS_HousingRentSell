import React, { useEffect, useState } from 'react'
import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Helpers/AuthContext';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';

function NavBar() {
  const { member, setMember, user, setUser } = useContext(AuthContext);
  const [right, setRight] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setRight(open);
  };
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{ backgroundColor: '#fff9f5', height: '100%' }}
    >
      <List>
        {['Chats', 'Team Members'].map((text, index) => (
          <Link key={index} to={`${text == 'Chats' ? '/chat' : text == 'Team Members' ? '/peopleChat' : ''}`}>
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {['Update Details', 'Applications', 'Queries', 'Add Property', 'User\'s Sell Request'].map((text, index) => (
          <Link to={`${text == "Update Details" ? "/updateDetails" : (text == "Queries" ? "/queries" : (text == "Applications" ? "/applications" : (text == "Add Property" ? "/addProperty" : (text == 'User\'s Sell Request' ? "/userSellRequest" : ""))))}`}>
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <ListItem>
        <div className=' items-center min-w-full flex justify-end'>
          {(!user && !member) ? (
            <Link style={{ minWidth: '100%' }} to="/login"><ListItemButton style={{ border: '2px solid black', display: 'flex', textAlign: 'center' }}><ListItemText primary={'Login'} /></ListItemButton></Link>
          ) :
            (
              <Link onClick={setLogout} style={{ minWidth: '100%' }} to="/login"><ListItemButton style={{ border: '2px solid black', display: 'flex', textAlign: 'center' }}><ListItemText primary={'Logout'} /></ListItemButton></Link>
            )}
        </div>
      </ListItem>
    </Box>
  );
  const list2 = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      style={{ backgroundColor: '#fff9f5', height: '100%' }}
    >
      {user && (
        <List>
          <Link to='/user/:queries'>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Queries" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/userAddProperty">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Sell Property" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/userAddProperty/sellData">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Selling Databse" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      )}
      {member && (
        <>
          <List>
            {['Chats', 'Team Members'].map((text, index) => (
              <Link key={index} to={`${text == 'Chats' ? '/chat' : text == 'Team Members' ? '/peopleChat' : ''}`}>
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            {['Update Details', 'Applications', 'Queries', 'Add Property', 'User\'s Sell Request'].map((text, index) => (
              <Link to={`${text == "Update Details" ? "/updateDetails" : (text == "Queries" ? "/queries" : (text == "Applications" ? "/applications" : (text == "Add Property" ? "/addProperty" : (text == 'User\'s Sell Request' ? "/userSellRequest" : ""))))}`}>
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </>
      )}
      <ListItem>
        <div className=' items-center min-w-full flex justify-end'>
          {(!user && !member) ? (
            <Link style={{ minWidth: '100%' }} to="/login"><ListItemButton style={{ border: '2px solid black', display: 'flex', textAlign: 'center' }}><ListItemText primary={'Login'} /></ListItemButton></Link>
          ) :
            (
              <Link onClick={setLogout} style={{ minWidth: '100%' }} to="/login"><ListItemButton style={{ border: '2px solid black', display: 'flex', textAlign: 'center' }}><ListItemText primary={'Logout'} /></ListItemButton></Link>
            )}
        </div>
      </ListItem>
    </Box>
  );
  const setLogout = () => {
    setUser(null);
    setMember(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessMemberToken');
    navigate('/login');
  }
  return (
    <div className="w-[100%] py-2 bg-[#fff7f0]">
      <div className="w-[90%] mx-auto flex flex-row justify-between items-center">
        <div className='hidden sm:flex items-center justify-center'>
          <img src={logo} alt="logo" className='w-[3rem] h-[3rem] rounded-full border-2 border-black' />
        </div>
        {/* Navigation Links */}
        <div className="flex text-sm md:text-lg">
          <ul className="list-none flex flex-row gap-5 cursor-pointer items-center">
            <Link to="/"><li className="p-2 md:p-5 hover:font-bold">Home</li></Link>
            <Link to="/listing"><li className="p-2 md:p-5 hover:font-bold">Listing</li></Link>
            <Link to="/agentList"><li className="p-2 md:p-5 hover:font-bold">Agents</li></Link>
            <Link to="/about"><li className="p-2 md:p-5 hover:font-bold">About Us</li></Link>
          </ul>
        </div>

        <div>
          <Button style={{ color: 'black' }} onClick={toggleDrawer(right, true)}><MenuIcon /></Button>
          <Drawer
            anchor={'right'}
            open={right}
            onClose={toggleDrawer('right', false)}
          >
            {list2(right)}
          </Drawer>
        </div>
        {/* {member && (
          <div>
            <Button style={{ color: 'black' }} onClick={toggleDrawer(right, true)}><MenuIcon /></Button>
            <Drawer
              anchor={'right'}
              open={right}
              onClose={toggleDrawer('right', false)}
            >
              {list(right)}
            </Drawer>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default NavBar;
