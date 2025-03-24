import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateObject, SupportedLanguages } from '@/lib/translator';

export function withTranslation<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function TranslatedComponent(props: P) {
        const { language } = useLanguage();
        const [translatedProps, setTranslatedProps] = useState<P>(props);

        useEffect(() => {
            const translateProps = async () => {
                const translatedData = await translateObject(props, language);
                setTranslatedProps(translatedData as P);
            };

            translateProps();
        }, [props, language]);

        return <WrappedComponent {...translatedProps} />;
    };
} 