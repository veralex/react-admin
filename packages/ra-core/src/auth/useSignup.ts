import { useCallback } from 'react';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { useLocation, useHistory } from 'react-router-dom';

const useSignup = (): Signup => {
    const authProvider = useAuthProvider();
    const location = useLocation();
    const locationState = location.state as any;
    const history = useHistory();
    const nextPathName = locationState && locationState.nextPathname;

    const signup = useCallback(
        (params: any = {}, pathName = defaultAuthParams.afterSignupURL) =>
            authProvider.signup(params).then(ret => {
                history.push(nextPathName || pathName);
                return ret;
            }),
        [authProvider, history, nextPathName]
    );

    const signupWithoutProvider = useCallback(
        (_, __) => {
            history.push(defaultAuthParams.afterSignupURL);
            return Promise.resolve();
        },
        [history]
    );

    return authProvider ? signup : signupWithoutProvider;
};

type Signup = (params: any, pathName?: string) => Promise<any>;

export default useSignup;
