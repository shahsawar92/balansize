"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import logger from "@/lib/logger";
import { type LoginFormData, loginSchema } from "@/lib/validation/auth";
import { useViewport } from "@/lib/view-port";

import Button from "@/components/buttons/Button";
import Input from "@/components/input/Input";
import UnderlineLink from "@/components/links/UnderlineLink";
import NextImage from "@/components/NextImage";
import Text from "@/components/text/Text";

import { useLoginMutation } from "@/redux/api/auth-api";
import { loginSuccess } from "@/redux/features/auth-slice";
import { useAppDispatch } from "@/redux/store";

export default function LoginPage() {
  // const [isLoading, setIsLoading] = useState(false);
  const { isMobile } = useViewport();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  // const router = useRouter();

  async function onSubmit(data: LoginFormData) {
    try {
      logger(data, "data to be sent to the server");

      const response = await login(data).unwrap();
      logger(response, "response from the server");

      if (!response.success) {
        toast.error(response.message, {
          position: "top-center",
          autoClose: 5000,
        });
        return;
      }

      // Dispatch loginSuccess only when login is successful
      dispatch(
        loginSuccess({
          token: response.result.accessToken,
          user: {
            id: response.result.user.id,
            name: `${response.result.user.first_name} ${response.result.user.last_name}`,
            email: response.result.user.email,
            user_type: response.result.user.user_type, // Role
          },
        })
      );

      toast.success(response.message, {
        position: "top-center",
        autoClose: 5000,
      });

      router.push("/dashboard");
    } catch (error) {
      logger(error, "error");
      toast.error("Login failed! Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  }

  return (
    <main className=''>
      <section
        className={clsx(
          "flex items-center justify-center lg:h-screen bg-secondary-100"
        )}>
        <div className='grid w-full layout grid-cols-1 gap-8 lg:grid-cols-2'>
          <div className='flex flex-col items-center justify-center'>
            <div className='md:w-56 mx-auto'>
              <NextImage
                useSkeleton
                src='/images/logo.png'
                alt='Balansize Logo'
                width='220'
                height='220'
                className='w-32 md:w-64'
              />
            </div>
          </div>
          <div className='flex flex-col justify-center items-center space-y-6 max-w-[460px] mx-auto'>
            <div className='space-y-2'>
              <Text
                variant='main'
                size='3xl'
                weight='bold'
                isCenterAligned={isMobile ? true : false}
                isUppercase={false}
                isItalic={false}>
                Welcome to Balansize
              </Text>
              <Text
                variant='secondary'
                size='sm'
                tagName='h3'
                weight='normal'
                isCenterAligned={isMobile ? true : false}
                isUppercase={false}
                isItalic={false}>
                Create your wellness journey - Join us today!
              </Text>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-4 self-center'>
              <Text
                variant='secondary'
                size='sm'
                tagName='h3'
                weight='bold'
                isCenterAligned={isMobile ? true : true}
                isUppercase={false}
                isItalic={false}>
                Enter your email & password
              </Text>
              <div className='max-w-[330px] space-y-8 self-center'>
                <Input
                  placeholder='Email'
                  variant='light'
                  sizeOfInput='large'
                  isPassword={false}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  placeholder='Password'
                  variant='light'
                  sizeOfInput='large'
                  isPassword={true}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  {...register("password")}
                />

                <Text
                  variant='secondary'
                  size='base'
                  weight='normal'
                  tagName='div'
                  isCenterAligned={false}
                  isUppercase={false}
                  isItalic={false}>
                  <div className='flex items-center justify-end -mt-7 mr-2'>
                    <UnderlineLink href='/forgot-password' className='text-sm'>
                      Forgot Password?
                    </UnderlineLink>
                  </div>
                </Text>

                <Button
                  type='submit'
                  className='w-full items-center justify-center rounded-full'
                  sizeOfButton='large'
                  variant='brown'
                  isLoading={isLoading}>
                  Login
                </Button>
              </div>
            </form>
            <Text
              variant='secondary'
              size='base'
              weight='normal'
              tagName='div'
              isCenterAligned={false}
              isUppercase={false}
              isItalic={false}>
              <p className='text-center text-sm text-muted-foreground'>
                By continuing, you agree to Balansize&apos;s{" "}
                <UnderlineLink href='/terms'>
                  Terms and Conditions
                </UnderlineLink>{" "}
                and{" "}
                <UnderlineLink href='/privacy'>Privacy Policy</UnderlineLink>
              </p>
            </Text>
          </div>
        </div>
      </section>
    </main>
  );
}
