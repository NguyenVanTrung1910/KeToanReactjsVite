import { useContext, useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../../menu';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Page from '../../../layout/Page/Page';
import ThemeContext from '../../../contexts/themeContext';
import DataGrid from '../../../components/table/DataGrid';
interface ComponentProps {
    namController: string;
    nameAction: string;
    loai: string;
}
const NhomDoiTuong: React.FC<ComponentProps> = ({ namController, nameAction, loai }) => {
    const { mobileDesign } = useContext(ThemeContext);
    const { setIsOpen } = useTour();
    useEffect(() => {
        if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
            setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem('tourModalStarted', 'shown');
            }, 7000);
        }
        return () => { };
    }, []);
    console.log("namController:", namController);

    return (
        // <KeepAlive>
        <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
            <Page container='fluid'>
                <div className='row'>
                    <div className='col-xxl-12'>
                        <DataGrid
                            apiUrlForAll={`${import.meta.env.VITE_API_URL}/${namController}`}
                            apiUrlGetTitle={`/${namController}/${nameAction}?loai=${loai}`}
                            loai={loai} />
                    </div>

                </div>
            </Page>
        </PageWrapper>
        //</KeepAlive>
    );
};

export default NhomDoiTuong;