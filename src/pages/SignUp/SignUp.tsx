import { useSessionDispatch } from "@/stores/SessionContext"
import { Box, Button, TextField, Typography, FormControl, FormLabel, Stack, styled, Card as MuiCard } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { User } from "@/types"
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/api";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email()
})

type IFormInput = z.infer<typeof schema>

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

export function SignUp() {
  const { login } = useSessionDispatch()
  const navigate = useNavigate();

  const {mutateAsync} = useMutation({
    mutationFn: (payload: User) => {
      return createUser(payload)
    },
  })
  
  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    resolver: zodResolver(schema)
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await mutateAsync({ ...data } as unknown as User)
    // Enable this line after implementing the first and last name fields
    login({ ...data } as unknown as User)
    // create user
    return navigate('/')
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
      <Typography component="h1" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>Sign Up</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <TextField 
                {...field} 
                required 
                fullWidth 
                placeholder="Your first name" 
                error={!!formState.errors.firstName}
                helperText={formState.errors.firstName?.message?.toString()} 
                color={!!formState.errors.firstName ? 'error' : 'primary'} 
              />
            </FormControl>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <TextField 
                {...field} 
                required 
                fullWidth 
                placeholder="Your last name" 
                error={!!formState.errors.lastName}
                helperText={formState.errors.lastName?.message?.toString()} 
                color={!!formState.errors.lastName ? 'error' : 'primary'} 
              />
            </FormControl>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField 
                {...field}
                type="email"
                required
                fullWidth
                placeholder="Your email address" 
                error={!!formState.errors.email}
                helperText={formState.errors.email?.message?.toString()} 
                color={!!formState.errors.email ? 'error' : 'primary'} 
              />
            </FormControl>
          )}
        />
        <Button variant="contained" type="submit">Login</Button>
      </Box>
      </Card>
    </SignUpContainer>
  )
}
