import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from 'react-final-form';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslate, useSignup, useNotify, useSafeSetState } from 'ra-core';

interface Props {
    redirectTo?: string;
}

interface FormData {
    username: string;
    password: string;
    name: string;
    lastname: string;
    confirmPassword: string;
}

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const useStyles = makeStyles(
    (theme: Theme) => ({
        form: {
            padding: '0 1em 1em 1em',
        },
        input: {
            marginTop: '1em',
        },
        button: {
            width: '100%',
        },
        icon: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'RaSignupForm' }
);

const Input = ({
    meta: { touched, error }, // eslint-disable-line react/prop-types
    input: inputProps, // eslint-disable-line react/prop-types
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);

const SignupForm: FunctionComponent<Props> = props => {
    const { redirectTo } = props;
    const [loading, setLoading] = useSafeSetState(false);
    const signup = useSignup();
    const translate = useTranslate();
    const notify = useNotify();
    const classes = useStyles(props);

    const validate = (values: FormData) => {
        const { password, confirmPassword, username, name, lastname } = values;
        const errors = {
            name: undefined,
            lastname: undefined,
            username: undefined,
            password: undefined,
            confirmPassword: undefined,
        };
        if (!name) {
            errors.name = translate('ra.validation.required');
        }
        if (!lastname) {
            errors.lastname = translate('ra.validation.required');
        }
        if (!username) {
            errors.username = translate('ra.validation.required');
        }
        if (!password) {
            errors.password = translate('ra.validation.required');
        }
        if (username && !username.match(EMAIL_REGEX)) {
            errors.username = translate('ra.validation.email');
        }
        if (password && password !== confirmPassword) {
            errors.password = "Password and confirmation don't match";
        }
        return errors;
    };

    const submit = values => {
        setLoading(true);
        signup(values, redirectTo)
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                        ? 'ra.signup.sign_up_error'
                        : error.message,
                    'warning'
                );
            });
    };

    return (
        <Form
            onSubmit={submit}
            validate={validate}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <div className={classes.form}>
                        <div className={classes.input}>
                            <Field
                                autofocus
                                id="name"
                                name="name"
                                component={Input}
                                label={translate('ra.signup.name')}
                                disabled={loading}
                            />
                        </div>
                        <div className={classes.input}>
                            <Field
                                id="lastname"
                                name="lastname"
                                component={Input}
                                label={translate('ra.signup.lastname')}
                                disabled={loading}
                            />
                        </div>
                        <div className={classes.input}>
                            <Field
                                id="username"
                                name="username"
                                component={Input}
                                label={translate('ra.signup.username')}
                                disabled={loading}
                            />
                        </div>
                        <div className={classes.input}>
                            <Field
                                id="password"
                                name="password"
                                component={Input}
                                label={translate('ra.signup.password')}
                                type="password"
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>
                        <div className={classes.input}>
                            <Field
                                id="confirmPassword"
                                name="confirmPassword"
                                component={Input}
                                label={translate('ra.signup.confirmPassword')}
                                type="password"
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>
                    <CardActions>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            className={classes.button}
                        >
                            {loading && (
                                <CircularProgress
                                    className={classes.icon}
                                    size={18}
                                    thickness={2}
                                />
                            )}
                            {translate('ra.signup.sign_up')}
                        </Button>
                    </CardActions>
                </form>
            )}
        />
    );
};

SignupForm.propTypes = {
    redirectTo: PropTypes.string,
};

export default SignupForm;
