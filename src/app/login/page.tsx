"use client";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginAction } from "@/api";
import { MuserpolLogo } from "@/components/icons";
import { useAlert } from "@/hooks/useAlerts";

interface FormData {
  user: string;
  password: string;
}

const classNames = {
  label: "text-black font-bold text-lg/2",
  inputWrapper: ["shadow-xl", "backdrop-blur-xl", "backdrop-saturate-200"],
};

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    user: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const { Alert } = useAlert();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): Boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.user) {
      newErrors.user = "El usuario es requerido";
    } else if (!/^[a-zA-Z]+$/.test(formData.user)) {
      newErrors.user = "El usuario solo debe contener letras";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener 6 caracteres";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);

      const response = await loginAction(formData.user, formData.password);
      const data = await response.json();

      if (!data.error) {
        setIsAnimating(true);
        router.push("/apphub");
      } else {
        Alert({ message: `${data.message}`, variant: "error" });
      }
    } catch (error) {
      console.error(error);
      Alert({ message: "Hubo un error en el servicio", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {!isAnimating && (
        <motion.div
          className="flex items-center border-20 justify-center min-h-screen bg-gradient-to-br from-stone-100 to-stone-200"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className="flex w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block lg:w-1/2 bg-cover bg-center"
              exit={{ x: 0, width: "100%" }}
              initial={{ opacity: 0, x: 0 }}
              style={{ backgroundImage: "url('muserpol.jpg')" }}
              transition={{ duration: 1 }}
            />
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-1/2 p-8"
              exit={{ x: -50, opacity: 0 }}
              initial={{ opacity: 0, x: 50 }}
              transition={{ duration: 1 }}
            >
              <Card
                className="w-full py-2 px-8 border-1"
                radius="none"
                shadow="none"
              >
                <form className="pb-5" onSubmit={handleSubmit}>
                  <CardHeader className="flex flex-col space-y-1">
                    <MuserpolLogo />
                    <h1 className="flex flex-row text-2xl font-bold text-center">
                      Iniciar sesión
                    </h1>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        required
                        aria-describedby={
                          errors.user ? "user-error" : undefined
                        }
                        aria-invalid={!!errors.user}
                        classNames={classNames}
                        errorMessage="Por favor ingrese su usuario"
                        id="user"
                        label="Usuario"
                        labelPlacement="outside"
                        name="user"
                        placeholder="Ingrese su usuario"
                        radius="sm"
                        type="text"
                        value={formData.user}
                        variant="flat"
                        onChange={handleInputChange}
                      />
                      {errors.user && (
                        <p className="text-sm text-red-400" id="user-error">
                          {errors.user}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          required
                          aria-describedby={
                            errors.password ? "password-error" : undefined
                          }
                          aria-invalid={!!errors.password}
                          classNames={classNames}
                          endContent={
                            <button
                              className="focus:outline-none"
                              type="button"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <FontAwesomeIcon
                                  className="h-5 w-5"
                                  icon={faEye}
                                />
                              ) : (
                                <FontAwesomeIcon
                                  className="h-5 w-5"
                                  icon={faEyeSlash}
                                />
                              )}
                            </button>
                          }
                          errorMessage="Por favor ingrese su contraseña"
                          id="password"
                          label="Contraseña"
                          labelPlacement="outside"
                          name="password"
                          placeholder="Ingrese su contraseña"
                          radius="sm"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          variant="flat"
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-400" id="password-error">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="shadow-xl">
                      <Button
                        className="space-y-4 w-full bg-lime-700 text-white font-bold"
                        disabled={isLoading}
                        type="submit"
                        variant="flat"
                      >
                        {isLoading ? "Iniciado sesión..." : "INICIAR SESIÓN"}
                      </Button>
                    </div>
                  </CardBody>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
